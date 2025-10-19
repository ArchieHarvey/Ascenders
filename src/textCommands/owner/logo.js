import { isSuperuser } from '../../services/roleService.js';
import { buildErrorEmbed, buildSuccessEmbed } from '../../utils/embed.js';

const MAX_AVATAR_BYTES = 256 * 1024;
const ALLOWED_CONTENT_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
]);
const ALLOWED_EXTENSION_REGEX = /\.(png|jpe?g|gif|webp)$/i;

const normalizeContentType = (value) => {
  if (!value) {
    return null;
  }
  const [type] = value.split(';');
  return type?.trim().toLowerCase() ?? null;
};

const inferAttachmentName = (attachment) => {
  if (attachment?.name) {
    return attachment.name;
  }

  try {
    const parsed = new URL(attachment.url);
    const segments = parsed.pathname.split('/').filter(Boolean);
    return segments.pop() ?? 'image';
  } catch (error) {
    return 'image';
  }
};

const resolveAttachmentSource = (attachments) => {
  if (!attachments?.size) {
    return null;
  }

  for (const attachment of attachments.values()) {
    if (!attachment?.url) {
      continue;
    }

    const contentType = normalizeContentType(attachment.contentType);
    const name = inferAttachmentName(attachment);

    if (contentType && ALLOWED_CONTENT_TYPES.has(contentType)) {
      return {
        origin: 'attachment',
        url: attachment.url,
        contentType,
        name,
        size: attachment.size ?? null,
      };
    }

    if (ALLOWED_EXTENSION_REGEX.test(name)) {
      return {
        origin: 'attachment',
        url: attachment.url,
        contentType,
        name,
        size: attachment.size ?? null,
      };
    }
  }

  return null;
};

const resolveArgumentSource = (args = []) => {
  const [candidate] = args;
  if (!candidate) {
    return null;
  }

  let parsed;
  try {
    parsed = new URL(candidate);
  } catch (error) {
    return null;
  }

  if (!['http:', 'https:'].includes(parsed.protocol)) {
    return null;
  }

  if (!ALLOWED_EXTENSION_REGEX.test(parsed.pathname)) {
    return null;
  }

  const name =
    parsed.pathname.split('/').filter(Boolean).pop() ?? 'image-from-url';

  return {
    origin: 'argument',
    url: parsed.toString(),
    contentType: null,
    name,
    size: null,
  };
};

const fetchImageBuffer = async (source) => {
  const response = await fetch(source.url);

  if (!response?.ok) {
    throw new Error('Could not download the image. Please try again.');
  }

  const contentType = normalizeContentType(
    response.headers.get('content-type'),
  );

  if (contentType && !ALLOWED_CONTENT_TYPES.has(contentType)) {
    throw new Error('The image must be PNG, JPG, GIF, or WEBP.');
  }

  const contentLengthHeader = response.headers.get('content-length');
  if (contentLengthHeader) {
    const contentLength = Number.parseInt(contentLengthHeader, 10);
    if (Number.isFinite(contentLength) && contentLength > MAX_AVATAR_BYTES) {
      throw new Error('The image is too large. Avatars must be under 256 KiB.');
    }
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  if (buffer.length > MAX_AVATAR_BYTES) {
    throw new Error('The image is too large. Avatars must be under 256 KiB.');
  }

  return buffer;
};

const buildUnauthorizedEmbed = () =>
  buildErrorEmbed({
    description: 'Only superusers can update the bot logo.',
  });

const buildMissingSourceEmbed = () =>
  buildErrorEmbed({
    description:
      'Attach an image (PNG, JPG, GIF, or WEBP under 256 KiB) or provide a direct image URL.',
  });

export default {
  name: 'logo',
  description: 'Upload a new bot logo (superusers only).',
  aliases: ['setlogo'],
  usage: '[image attachment|image URL]',
  async execute(message, args) {
    const allowed = await isSuperuser(message.author.id);

    if (!allowed) {
      await message.reply({
        embeds: [buildUnauthorizedEmbed()],
        allowedMentions: { repliedUser: false, parse: [] },
      });
      return;
    }

    if (!message.client?.user) {
      await message.reply({
        embeds: [
          buildErrorEmbed({
            description: 'The bot client is not ready. Please try again shortly.',
          }),
        ],
        allowedMentions: { repliedUser: false, parse: [] },
      });
      return;
    }

    const attachmentSource = resolveAttachmentSource(message.attachments);
    const argumentSource = attachmentSource ? null : resolveArgumentSource(args);

    const source = attachmentSource ?? argumentSource;

    if (!source) {
      await message.reply({
        embeds: [buildMissingSourceEmbed()],
        allowedMentions: { repliedUser: false, parse: [] },
      });
      return;
    }

    if (source.size && source.size > MAX_AVATAR_BYTES) {
      await message.reply({
        embeds: [
          buildErrorEmbed({
            description:
              'The attached file is too large. Avatars must be under 256 KiB.',
          }),
        ],
        allowedMentions: { repliedUser: false, parse: [] },
      });
      return;
    }

    try {
      const buffer = await fetchImageBuffer(source);

      await message.client.user.setAvatar(buffer);

      const embed = buildSuccessEmbed({
        title: 'Bot logo updated',
        description:
          source.origin === 'attachment'
            ? 'The uploaded image is now the bot logo.'
            : 'The image at the provided URL is now the bot logo.',
      });

      embed.setThumbnail(
        message.client.user.displayAvatarURL({
          size: 256,
          forceStatic: false,
        }),
      );

      await message.reply({
        embeds: [embed],
        allowedMentions: { repliedUser: false, parse: [] },
      });
    } catch (error) {
      console.error('Failed to update bot avatar (text command):', error);

      await message.reply({
        embeds: [
          buildErrorEmbed({
            description:
              error?.message ??
              'Could not update the bot logo right now. Please try again later.',
          }),
        ],
        allowedMentions: { repliedUser: false, parse: [] },
      });
    }
  },
};
