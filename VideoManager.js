
function scrubChanged()
{
  var ct = (scrubPos * totalDuration)/100;
  var idx = 0;
  for(var i=0;i<files.length;i++)
  {
    if(ct > timeTable[i])
    {
      idx = i;
    }
    else
    {
      break;
    }
  }
  var playagain = false;
  if(!vid.paused)
  {
    playagain = true;
  }
  if(currentVideoID != idx)
  {
    currentVideoID = idx;
    vid.src = encodeVideoURL(files[currentVideoID]);
    //vid.load();
  }
  if(vid.duration < ct - timeTable[currentVideoID])
  {
    vid.currentTime = vid.duration-0.01;
  }
  else
  {
  vid.currentTime = ct - timeTable[currentVideoID];
  }

  if(playagain)
  {
    vid.play();
  }
  else
  {
    vid.pause();
  }

  document.getElementById("currentTimecode").innerHTML = setTimeCode(ct);
  skipTimeChange = true;
  updateScrolls();
}

function updateScrubVis()
{
  var ct = timeTable[currentVideoID] + vid.currentTime;
  timeSlider.style.left = (ct/totalDuration)*100+"%";
  document.getElementById("currentTimecode").innerHTML = setTimeCode(ct);
  //skipTimeChange = true;
  if(!isPaused)
  updateScrolls();
}

function getVideoToAbsoluteTime(t)
{
  var idx = 0;
  for (var i = timeTable.length - 1; i >= 0; i--) {
    if(t > timeTable[i])
    {
      idx = i;
      break;
    }
  }
  if(idx!=currentVideoID)
  {
    currentVideoID = idx;
    vid.src = files[currentVideoID];
    vid.load();
  }
  vid.currentTime = t - timeTable[currentVideoID];
}

timeline.addEventListener('pointerdown', function(event) {
  isDragging = true;
  markini = event.pageX - timelineRect.left - window.scrollX;
  timelineWidth = timelineRect.width;
  timeSlider.style.left = (markini/timelineWidth)*100+"%";
  scrubPos = (markini/timelineWidth)*100;
  scrubChanged();
}, false);

canvas.addEventListener('pointerdown', function(event) {
  event.stopPropagation();
  if(!vid.paused)
  {
    vid.pause();
    return;
  }
  if(toolMode==2)
  {
    ctx.globalCompositeOperation="source-over";
    penWidth = brushSize*event.pressure;
    isPainting = true;
    lastX = event.pageX - canvasRect.left - window.scrollX;
    lastY = event.pageY - canvasRect.top - window.scrollY;
    lastX = (lastX*canvas.width)/canvas.offsetWidth;
    lastY = (lastY*canvas.height)/canvas.offsetHeight;
    ctx.beginPath();
    ctx.arc(lastX, lastY, penWidth/2, 0, 2 * Math.PI, false);
    ctx.fill();console.log(lastX + ", " + lastY);
  }
  if(toolMode==3)
  {
    ctx.globalCompositeOperation="destination-out";
    penWidth = brushSize*event.pressure;
    isPainting = true;
    lastX = event.pageX - canvasRect.left - window.scrollX;
    lastY = event.pageY - canvasRect.top - window.scrollY;
    lastX = (lastX*canvas.width)/canvas.offsetWidth;
    lastY = (lastY*canvas.height)/canvas.offsetHeight;
    ctx.beginPath();
    ctx.arc(lastX, lastY, penWidth/2, 0, 2 * Math.PI, false);
    ctx.fill();
  }

  if(toolMode ==1)
  {
    isVideoScrolling = true;
    lastX = event.pageX;
    iniX = lastX;
    iniY = event.pageY;
        //pause();
  }
}, false);

canvas.addEventListener('pointermove', function(event) {
  cursor.left = event.pageX - (brushSize/3.5+2)/2 + "px";
  cursor.top = event.pageY - (brushSize/3.5+2)/2 + "px";
  cursor.width = brushSize/3.5+2 + "px";
  cursor.height = brushSize/3.5+2 + "px";
  if(toolMode != 1)
  cursor.display = "block";

  if(isPainting)
  {
    var x = event.pageX - canvasRect.left - window.scrollX;
    var y = event.pageY - canvasRect.top - window.scrollY;
    x = (x*canvas.width)/canvas.offsetWidth;
    y = (y*canvas.height)/canvas.offsetHeight;
    penWidth = brushSize*event.pressure;
    ctx.lineWidth = penWidth;

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);console.log(x + ", " + y);
    ctx.stroke();
    lastX = x;
    lastY = y;
  }
}, false);

canvas.addEventListener('pointerup', function(event) {
  if(toolMode == 1)
  {
    if(Math.abs(event.pageX - iniX) + Math.abs(event.pageY - iniY) < 6 )
    {          
      playToggle();
    } 
  }
}, false);

canvas.addEventListener('pointerleave', function(event) {
  // if(isPainting)
  // {
  //   isPainting = false;
  //   captureCanvasState();
  // }
  // cursor.display = "none";
}, false);

document.addEventListener('pointerdown', function(event) {
  if(!isPainting)
    lastX = event.pageX;
},false);

document.addEventListener('click', function(event) {
  selectedFiles = [];
},false);

document.addEventListener('pointermove', function(event) {
  if(isDragging)
  {                
    markcurrent = event.pageX - timelineRect.left - window.scrollX;
    if(markcurrent < 0)
    {
      timeSlider.style.left = "0%";
      scrubPos = 0;
    }
    else if(markcurrent > timelineWidth)
    {
      timeSlider.style.left = "100%";
      scrubPos = 100;
    }
    else
    {                      
      timeSlider.style.left = (markcurrent/timelineWidth)*100+"%";
      scrubPos = (markcurrent/timelineWidth)*100;
    }
    scrubChanged();
  }
  if(isVideoScrolling)
  {
  var newX = event.pageX;
  if(videoScrollTime == 0)
    videoScrollTime = currentTime;
  videoScrollTime += (newX - lastX)/24;
  if(videoScrollTime > totalDuration)
  {
    videoScrollTime = 0;
  }
  if(videoScrollTime<0)
  {
    videoScrollTime = totalDuration;
  }
  getVideoToAbsoluteTime(videoScrollTime);
  lastX = newX;
  updateScrubVis();
}
if(isSidebarResizing)
{
  var newX = event.pageX;
  var diff = (newX - lastX);
  rightPart.style.width = rightPart.offsetWidth - diff + "px";
  lastX = newX;
  windowResized();
  reReadScrolls();
}
if(isFilesResizing)
{
  var newX = event.pageX;
  var diff = (newX - lastX);
  FilesSection.style.width = FilesSection.offsetWidth + diff + "px";
  lastX = newX;
  windowResized();
}
}, false);

document.addEventListener('pointerup', function(event) {
  if(isPainting)
  {
    captureCanvasState();
  }
  isPainting = false;
  isDragging = false;
  isVideoScrolling = false;
  videoScrollTime = 0;
  if(isSidebarResizing || isFilesResizing)
    savePrefs();
  isSidebarResizing = false; 
  if(isFilesResizing)
    RefreshFileList();
  isFilesResizing = false;
}, false);

vid.onended = function() {
  var idx = files.indexOf(GetCurrentVideoURL());
  idx++;
  if(idx >= files.length)
  {
    idx = 0;
  }
  var tp = vid.paused;
  if(currentVideoID == idx)
  {
    return;
  }
  currentVideoID = idx;
  vid.src = files[idx];
  vid.load();
  if(!tp)
    vid.play();
};
 
 vid.onloadedmetadata = function() {
   if(areVideosLoading)
   {console.log(currentVideoID);
    filePath = files[currentVideoID];
    checkForFile();
    timeTable.push(totalDuration);
    totalDuration += vid.duration;
    currentVideoID++;
    if(currentVideoID == files.length)
    {
      pop("All Videos Loaded");
      currentVideoID = 0;
      areVideosLoading = false;
      vid.src = encodeVideoURL(files[0]);
      vid.currentTime = 0;
      document.getElementById("durationTimecode").innerHTML = setTimeCode(totalDuration);
      timeSlider.style.left = "0%";
      document.getElementById("currentTimecode").innerHTML = setTimeCode(0);
      vid.load();
      iniCorrections();
      loadCorrections(0);
      updateComments();
    }
    else
    {
      vid.src = files[currentVideoID];
      vid.load();
    }    
   }
};

vid.ontimeupdate = function() {
  currentTime = timeTable[currentVideoID] + vid.currentTime;
  if(isExporting)
  {
    if(currentTime == correctionTimes[exportID] || isUniExport)
      exportCorrections();
    return;
  }
  updateScrubVis();
  if(!isPaused)
  {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if(isCommentClicked || Math.abs(currentTime-currentCommentTime) < 0.05)
  {
    t = currentCommentTime;
    if(t != timeTable[currentVideoID] && t != timeTable[currentVideoID] + vid.duration && corrections[t])
    {
    var canvasPic = new Image();
    canvasPic.src = corrections[t].visData;
    canvasPic.onload= function(){
    ctx.globalCompositeOperation="source-over";
    ctx.globalAlpha = 1;
    ctx.drawImage(canvasPic, 0, 0);
    ctx.globalAlpha = document.getElementById("opacityRange").value/100;
    }
  }
  }
  queue = [];
  currentQueueID = 0;
  queue[queue.length] = canvas.toDataURL();
  }
  isPaused = false;
  isCommentClicked = false;
};

vid.onplaying = function() {
  document.getElementsByClassName("control")[0].style.backgroundImage = "url('icons/pause.png')";
};

vid.onpause = function() {
  document.getElementsByClassName("control")[0].style.backgroundImage = "url('icons/play.png')";
};
