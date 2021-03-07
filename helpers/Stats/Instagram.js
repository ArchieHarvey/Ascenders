const fetch = require("node-fetch");

module.exports.fetchAccount = async function(id){
  let url = `https://www.instagram.com/${id}/?__a=1`

  // Get profile information using url
  let results = await fetch(url)

  // If there's no results return false
  if(results.status !== 200){
    return false;
  }

  results = await results.json();

  // Get information about the user
  let data = {
    id: results.graphql.user.username,
    name: `${results.graphql.user.full_name ? results.graphql.user.full_name : "Unknown"}`,
    bio: `${results.graphql.user.biography ? results.graphql.user.biography : "No Bio"}`,
    private: `**${results.graphql.user.is_private ? "Yes 🔐" : "No 🔓"}**`,
    followers: results.graphql.user.edge_followed_by.count,
    posts: results.graphql.user.edge_owner_to_timeline_media.count,
    
    following: results.graphql.user.edge_follow.count,
    image: results.graphql.user.profile_pic_url_hd,
    verified: `${results.graphql.user.is_verified ? `<a:verified:815687591780679701>` : "Not Verified"}`
  }

  // Get information about each image
  let images = results.graphql.user.edge_owner_to_timeline_media;
  let imgArr = [];
  for(let i=0; i < images.edges.length; i++){
    let imageData = {
      image: images.edges[i].node.display_url,
      likes: images.edges[i].node.edge_liked_by.count,
      comments: images.edges[i].node.edge_media_to_comment.count
    }
    imgArr.push(imageData)
  }

  // Sort likes from most to least
  await imgArr.sort(function(a, b){return a.likes - b.likes});

  data.imageData = imgArr;

  return data;

};
