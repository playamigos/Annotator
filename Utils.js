//Notif methods
function pop(msg)
{
  console.log(msg);
  document.getElementById("NotifContainer").remove();
  var html = "<div id='NotifContainer' class='popup'><center><span id='Notif'>"+msg+"</span></center></div>";
  var child = document.createElement('div');
  child.innerHTML = html;
  child = child.firstChild;
  document.body.appendChild(child);
}

//Shorten file names
function shortenFileName(name)
{
  var ln = FilesContainer.offsetWidth / 12;
  if(name.length > ln)
  {
    name = name.substring(0,Math.floor(ln/2)) + "..." + name.substring(name.length-Math.floor(ln/2) + 3);
  }
  return name;
}


function encodeVideoURL(url)
{
  newURL = url;
  return newURL;
}

function timeToScroll(t)
{
  var a,b,c;
  a = 0;
  b = currentScrolls.length - 1;
  while(b-a > 1)
  {
    c = Math.floor((a+b)/2);
    if(currentCorrectionTimes[c] < t)
    {
      a = c;
    }
    else if(currentCorrectionTimes[c] >= t)
    {
      b = c;
    }
  }
  c = (t - currentCorrectionTimes[a])/ (currentCorrectionTimes[b] - currentCorrectionTimes[a]);
  return currentScrolls[a] + c*(currentScrolls[b] - currentScrolls[a]);
}

function setTimeCode(t)
{
  var min = Math.floor(t/60);
  var sec = Math.floor(t%60);
  var frm = Math.floor((t%1)*fps);

  var code = "";
  code += (min<10) ? "0" + min : min;
  code += ":";
  code += (sec<10) ? "0" + sec : sec;
  code += ":";
  code += (frm<10) ? "0" + frm : frm;
  return code;
}
