document.addEventListener("DOMContentLoaded", function () {
  let link = document.createElement("link");
  link.setAttribute("rel", "stylesheet");
  /*link.setAttribute(
    "href",
    "https://maxcdn.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"
  );*/
  let link1 = document.createElement("link");
  link1.setAttribute("rel", "stylesheet");
  link1.setAttribute(
    "href",
    "https://dry-river-91831.herokuapp.com/assets/build/index.min.css"
  );
  let link2 = document.createElement("link");
  link2.setAttribute("rel", "stylesheet");
  link2.setAttribute(
    "href",
    "https://dry-river-91831.herokuapp.com/assets/build/iframeStyles.min.css"
  );

  let script1 = document.createElement("SCRIPT");
  let script2 = document.createElement("SCRIPT");
  /*script1.setAttribute(
    "src",
    "https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js"
  );
  script2.setAttribute(
    "src",
    "https://maxcdn.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js"
  );*/

  let head = document.getElementsByTagName("head")[0];
  head.appendChild(script1);
  head.appendChild(script2);
  head.appendChild(link);
  head.appendChild(link1);
  head.appendChild(link2);

  //document.cookie = "cross-site-cookie=bar; SameSite=Lax";

  //let container = document.getElementById('chat-container');
  let container = document.getElementById("chat-container");

  

  let div = document.createElement("div");
  div.className = "row m-0 p-0 pr-3";
  let i = document.createElement("i");
  i.style.cursor = "pointer";
  let im = document.createElement("img");
  im.setAttribute("src", "https://dry-river-91831.herokuapp.com/assets/images/posmin cloud.jpg")
  im.style.height = "50px";
  i.className = "fas fa-times ml-auto";
  div.appendChild(im);
  div.appendChild(i);
  
  container.prepend(div);
  //first container ends

  let newDiv = document.createElement("div");
  let button = document.createElement("button");
  button.className =
    "round-button mr-3 mb-3 shadow justify-content-center align-items-center";
  button.style.cursor = "pointer";
  let span = document.createElement("span");
  let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.style.enableBackground = "new 0 0 500 500";
  svg.style.height = "34px";
  svg.style.width = "34px";
  svg.setAttribute("id", "Layer_1");
  svg.setAttribute("version", "1.1");
  svg.setAttribute("viewBox", "0 0 500 500");
  svg.setAttribute("xml:space", "preserve");
  //svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  svg.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");

  let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.style.clipRule = "evenodd";
  path.setAttribute(
    "d",
    "M36.992,326.039c0,20.079,16.262,36.34,36.34,36.34h54.513v56.062  c0,10.087,8.181,18.168,18.172,18.168c5.092,0,9.714-2.095,12.989-5.448l68.78-68.781h199.881c20.078,0,36.34-16.261,36.34-36.34  V98.902c0-20.079-16.262-36.341-36.34-36.341H73.333c-20.079,0-36.34,16.262-36.34,36.341V326.039z M146.018,221.557  c0-12.536,10.177-22.713,22.713-22.713c12.536,0,22.713,10.177,22.713,22.713c0,12.537-10.177,22.713-22.713,22.713  C156.194,244.27,146.018,234.093,146.018,221.557z M227.787,221.557c0-12.536,10.177-22.713,22.713-22.713  c12.537,0,22.715,10.177,22.715,22.713c0,12.537-10.178,22.713-22.715,22.713C237.964,244.27,227.787,234.093,227.787,221.557z   M309.556,221.557c0-12.536,10.176-22.713,22.715-22.713c12.537,0,22.711,10.177,22.711,22.713  c0,12.537-10.174,22.713-22.711,22.713C319.731,244.27,309.556,234.093,309.556,221.557z"
  );
  path.style.fill = "#fff";
  path.style.fillRule = "evenodd";
  svg.appendChild(path);
  span.appendChild(svg);
  button.appendChild(span);
  newDiv.appendChild(button);

  container.parentNode.insertBefore(newDiv, container.nextSibling);

  $(".round-button").click(function () {
    console.log("clicked");
    $(".round-button").toggle("300");
    $(".chat-container").toggle("300");
  });

  $(".fa-times").click(function () {
    console.log("clicked");
    $(".chat-container").toggle("300");
    $(".round-button").toggle("300");
  });
});
