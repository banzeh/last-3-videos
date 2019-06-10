document.addEventListener("DOMContentLoaded", function() {
  console.log("Tá rodando");
  carregaYoutube();
});

// Cria uma div com a Thumb
function loadThumb(divYoutube, item){
  var videoid = item.guid.replace("yt:video:", "");
  divYoutube.children.namedItem("imagem").setAttribute("data-videoid", videoid);
  divYoutube.children.namedItem("imagem").setAttribute("src", item.thumbnail);
  divYoutube.children.namedItem("link").setAttribute("href", item.link);
  divYoutube.children.namedItem("link").children.namedItem("descricao").innerHTML = item.title;
  divYoutube.onclick = loadVideo;
}

function loadVideo(){
  var iframe = document.createElement("iframe");
  var embed = "https://www.youtube.com/embed/ID?autoplay=1";
  iframe.setAttribute("src", embed.replace("ID", this.children[0].dataset.videoid));
  iframe.setAttribute("frameborder", "0");
  iframe.setAttribute("allowfullscreen", "1");
  console.log('this', this);
  this.parentNode.replaceChild(iframe, this);
}

// Retorna o Feed do Youtube
function getYoutubeFeed(channelId) {
  return new Promise(function(resolve, reject){
    var encodedYoutubeUrlFeed = encodeURIComponent("https://www.youtube.com/feeds/videos.xml?channel_id=" + channelId);
    var reqURL = "https://api.rss2json.com/v1/api.json?rss_url=" + encodedYoutubeUrlFeed;
    $.getJSON(reqURL)
      .done(function(data) {
        return resolve(data);
      })
      .fail(function(err){
        return reject(err);
      })
  })
}

function carregaYoutube(){
  var divsYoutube = document.getElementsByClassName("youtubeVideos");
  var channelId = document.getElementById("youtubeUser").dataset.channelid;
  
  getYoutubeFeed(channelId)
  .then(function(feedYoutube) {
    console.log(feedYoutube)
    var headerYoutube = document.getElementById("headerYoutube");
    headerYoutube.innerHTML = "Últimos vídeos de <a href=\""+ feedYoutube.feed.link +"\">" + feedYoutube.feed.author + "</a>";
    for (var i = 0; i < divsYoutube.length; i++){
      loadThumb(divsYoutube[i], feedYoutube.items[i]);
    }
  })
  .catch(function(err){
    alert("Ocorreu o seguinte erro: " + err);
  })
}
