//Window related
function windowResized()
{ 
  leftPart.style.width = document.body.offsetWidth - rightPart.offsetWidth - FilesSection.offsetWidth + "px";
  leftPart.style.left = FilesSection.offsetWidth + "px";
  FilesContainer.style.height = FilesSection.offsetHeight - 220 + "px";
  canvasRect = canvas.getBoundingClientRect();
  reAlignTags();
  var t = 1;
  var t1 = 1;
    toolsContainerTag.style.transform = "scale(1,1)";
    toolsContainerTag.style.left = "0px";
    toolsContainerTag.style.width = "100%";
    //controlsContainerTag.style.transform = "scale(1,1)";
    //controlsContainerTag.style.left = "0px";
    //controlsContainerTag.style.width = "100%";
    timelineParentTag.style.transform = "scale(1,1)";
    timelineParentTag.style.left = "0px";
    timelineParentTag.style.width = "100%";

  if(toolsContainerTag.offsetWidth < 780)
  {
    t = toolsContainerTag.offsetWidth/780;
    toolsContainerTag.style.transform = "scale("+t+","+t+")";
    toolsContainerTag.style.left = (780 - toolsContainerTag.offsetWidth)/-2 + "px";
    toolsContainerTag.style.width = "780px";
    //controlsContainerTag.style.transform = "scale("+t+","+t+")";
    //controlsContainerTag.style.left = (780 - controlsContainerTag.offsetWidth)/-2 + "px";
    //controlsContainerTag.style.width = "780px";
    timelineParentTag.style.transform = "scale("+t+","+t+")";
    timelineParentTag.style.left = (780 - timelineTag.offsetWidth)/-2 + "px";
    timelineParentTag.style.width = "780px";
  }
  timelineRect = timeline.getBoundingClientRect();
}


document.ondragover = document.ondrop = (ev) => {ev.preventDefault();};
document.body.onresize = function(){windowResized();};
document.body.onscroll = function(){windowResized();};
document.body.onload = function(){windowResized();queue[queue.length] = canvas.toDataURL();};

//File events
document.ondrop = (ev) => {
  ev.preventDefault();
  videoDropped(ev);
}

cmtsResizer.addEventListener('pointerdown', function(event) {
  isSidebarResizing = true;
}, false);

FilesResizer.addEventListener('pointerdown', function(event) {
  isFilesResizing = true;
}, false);















