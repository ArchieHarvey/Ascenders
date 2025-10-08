import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  Client,
  EmbedBuilder,
  GuildTextBasedChannel
} from 'discord.js';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import { config } from '../config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const stateFilePath = path.resolve(__dirname, '../../data/update-state.json');

interface UpdateState {
  deployedSha?: string;
  pendingSha?: string;
}

interface GitHubCommitResponse {
  sha: string;
  html_url: string;
  commit: {
    message: string;
    author: {
      name: string;
      date: string;
    };
  };
}

export class UpdateService {
  private state: UpdateState = {};
  private interval?: NodeJS.Timeout;
  private pendingMessages = new Map<string, string>();

  constructor(private readonly client: Client) {}

  async init() {
    await this.ensureStateFile();
    await this.loadState();
    await this.checkForUpdates();
    this.interval = setInterval(() => {
      this.checkForUpdates().catch((error) => {
        console.error('Failed to check for updates', error);
      });
    }, config.updateCheckIntervalMs).unref?.();
  }

  async destroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  async handleInteraction(interaction: ButtonInteraction) {
    const [prefix, action, sha] = interaction.customId.split(':');
    if (prefix !== 'update') {
      return;
    }

    if (config.ownerIds.length > 0 && !config.ownerIds.includes(interaction.user.id)) {
      await interaction.reply({
        content: 'You do not have permission to approve updates.',
        ephemeral: true
      });
      return;
    }

    if (sha !== this.state.pendingSha) {
      await interaction.reply({
        content: 'This update request is no longer active.',
        ephemeral: true
      });
      return;
    }

    if (action === 'approve') {
      await this.handleApprove(interaction, sha);
    } else if (action === 'reject') {
      await this.handleReject(interaction, sha);
    }
  }

  private async handleApprove(interaction: ButtonInteraction, sha: string) {
    await interaction.deferReply({ ephemeral: true });
    try {
      const result = await this.performUpdate();
      await interaction.editReply({
        content: `Update to commit ${sha} completed.\n${result}`
      });
      this.state.deployedSha = sha;
      this.state.pendingSha = undefined;
      await this.persistState();
      const message = await interaction.message.fetch();
      await message.edit({
        components: [],
        embeds: [
          EmbedBuilder.from(message.embeds[0] ?? {})
            .setColor(0x57f287)
            .setFooter({ text: 'Update applied successfully.' })
        ]
      });
    } catch (error) {
      console.error('Update failed', error);
      await interaction.editReply({
        content: `Update failed: ${(error as Error).message}`
      });
      const message = await interaction.message.fetch();
      await message.edit({
        components: [],
        embeds: [
          EmbedBuilder.from(message.embeds[0] ?? {})
            .setColor(0xed4245)
            .setFooter({ text: 'Update failed. See response thread for details.' })
        ]
      });
    }
  }

  private async handleReject(interaction: ButtonInteraction, sha: string) {
    await interaction.update({
      content: `Update ${sha} rejected by ${interaction.user.tag}.`,
      embeds: [],
      components: []
    });
    this.state.pendingSha = undefined;
    await this.persistState();
  }

  private async ensureStateFile() {
    try {
      await fs.access(stateFilePath);
    } catch {
      await fs.mkdir(path.dirname(stateFilePath), { recursive: true });
      await fs.writeFile(stateFilePath, JSON.stringify({}, null, 2), 'utf8');
    }
  }

  private async loadState() {
    try {
      const raw = await fs.readFile(stateFilePath, 'utf8');
      this.state = JSON.parse(raw) as UpdateState;
    } catch (error) {
      console.warn('Failed to read update state; starting fresh.', error);
      this.state = {};
    }
  }

  private async persistState() {
    await fs.writeFile(stateFilePath, JSON.stringify(this.state, null, 2), 'utf8');
  }

  private async checkForUpdates() {
    const latest = await this.fetchLatestCommit();
    if (!latest) {
      return;
    }

    if (latest.sha === this.state.deployedSha || latest.sha === this.state.pendingSha) {
      return;
    }

    await this.notifyPendingUpdate(latest);
    this.state.pendingSha = latest.sha;
    await this.persistState();
  }

  private async fetchLatestCommit(): Promise<GitHubCommitResponse | null> {
    const { owner, repo } = config.githubRepository;
    const url = `https://api.github.com/repos/${owner}/${repo}/commits/${config.githubBranch}`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'AscendersBot/1.0',
        ...(config.githubToken ? { Authorization: `Bearer ${config.githubToken}` } : {})
      }
    });

    if (response.status === 304) {
      return null;
    }

    if (!response.ok) {
      throw new Error(`GitHub API request failed with status ${response.status}`);
    }

    const data = (await response.json()) as GitHubCommitResponse;
    return data;
  }

  private async notifyPendingUpdate(commit: GitHubCommitResponse) {
    const channel = await this.resolveUpdateChannel();
    if (!channel) {
      console.warn('Update channel not found or not text-based.');
      return;
    }

    const embed = new EmbedBuilder()
      .setTitle('Pending Update Available')
      .setDescription(commit.commit.message.split('\n')[0])
      .addFields(
        { name: 'Commit', value: `[${commit.sha.substring(0, 7)}](${commit.html_url})` },
        { name: 'Author', value: commit.commit.author.name, inline: true },
        { name: 'Date', value: new Date(commit.commit.author.date).toLocaleString(), inline: true }
      )
      .setColor(0xf1c40f)
      .setTimestamp(new Date(commit.commit.author.date));

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId(`update:approve:${commit.sha}`)
        .setLabel('Approve Update')
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId(`update:reject:${commit.sha}`)
        .setLabel('Reject Update')
        .setStyle(ButtonStyle.Danger)
    );

    const message = await channel.send({
      content: config.ownerIds.length
        ? `Update available. Only <@${config.ownerIds.join('>, <@')}> may approve.`
        : 'Update available. Review and approve if you have permission.',
      embeds: [embed],
      components: [row]
    });

    this.pendingMessages.set(message.id, commit.sha);
  }

  private async resolveUpdateChannel(): Promise<GuildTextBasedChannel | null> {
    const channel = await this.client.channels.fetch(config.updateChannelId);
    if (!channel || !channel.isTextBased() || !('guildId' in channel)) {
      return null;
    }

    return channel as GuildTextBasedChannel;
  }

  private async performUpdate(): Promise<string> {
    const commands: Array<{ command: string; args: string[] }> = [
      { command: 'git', args: ['pull', 'origin', config.githubBranch] },
      { command: 'npm', args: ['install'] },
      { command: 'npm', args: ['run', 'build'] }
    ];

    const outputs: string[] = [];

    for (const { command, args } of commands) {
      const resolvedCommand = this.resolveCommand(command);
      const { stdout, stderr } = await this.runCommand(resolvedCommand, args);
      outputs.push(
        `$ ${command} ${args.join(' ')}\n${stdout}${stderr ? `\n${stderr}` : ''}`.trim()
      );
    }

    return outputs.join('\n\n');
  }

  private resolveCommand(command: string) {
    if (process.platform === 'win32') {
      return `${command}.cmd`;
    }

    return command;
  }

  private runCommand(command: string, args: string[]) {
    return new Promise<{ stdout: string; stderr: string }>((resolve, reject) => {
      const child = spawn(command, args, { stdio: ['ignore', 'pipe', 'pipe'] });
      const stdout: Buffer[] = [];
      const stderr: Buffer[] = [];

      child.stdout.on('data', (chunk) => stdout.push(Buffer.from(chunk)));
      child.stderr.on('data', (chunk) => stderr.push(Buffer.from(chunk)));

      child.once('error', reject);
      child.once('close', (code) => {
        if (code === 0) {
          resolve({ stdout: Buffer.concat(stdout).toString('utf8'), stderr: Buffer.concat(stderr).toString('utf8') });
        } else {
          reject(
            new Error(
              `${command} ${args.join(' ')} exited with code ${code}.\n${Buffer.concat(stderr).toString('utf8')}`
            )
          );
        }
      });
    });
  }
}
