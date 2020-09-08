const electron = require('electron');
 
electron.ipcRenderer.on('mClick', (event, arg) => {
  if(document.activeElement.tagName != "INPUT" && document.activeElement.tagName != "TEXTAREA")
  {
      if(arg=="open")
        openFileDialogue();
      else if(arg == "save")
        saveCorrections();
      else if(arg == "exportOne")
        uniExport();
      else if(arg == "exportAll")
        iniExport();
      else if(arg == "undo")
        undo();
      else if(arg == "redo")
        redo();
      else if(arg == "deleteEmpty")
        DeleteAllEmptyCmts();
      else if(arg == "pref")
        openPref();
      else if(arg == "play"){
        if(!isTyping)
        playToggle();
      }
      else if(arg == "pframe"){
        if(!isTyping)
        pushFrame(1);
      }
      else if(arg == "nframe"){
        if(!isTyping)
        pushFrame(-1);
      }
      else if(arg == "pcomment"){
        if(!isTyping)
        pushToComment(1);
      }
      else if(arg == "ncomment"){
        if(!isTyping)
        pushToComment(-1);
      }
      else if(arg == "gstart"){
        if(!isTyping)
        pushToEnds(1);
      }
      else if(arg == "gend"){
        if(!isTyping)
        pushToEnds(-1);
      }
      else if(arg == "website"){}
      else if(arg == "about"){}
      else{}
  }
});


function changeColor(ele)
{
  if(ele.children[0].className == "colorPick colorSelect")
  {
    colorPicker.value = ele.children[0].dataset.color;
    colorPicker.onchange = (ev) => {
      ele.children[0].style.backgroundColor = colorPicker.value;
      ctx.fillStyle = colorPicker.value ;
      ctx.strokeStyle = colorPicker.value ;
      ele.children[0].dataset.color = colorPicker.value;
      savePrefs();
    };
    colorPicker.click();
    return;
  }
  document.getElementsByClassName("colorSelect")[0].className = "colorPick";
  ele.children[0].className = "colorPick colorSelect";
  ctx.fillStyle = ele.children[0].style.backgroundColor ;
  ctx.strokeStyle = ele.children[0].style.backgroundColor ;
}

function pushToEnds(t)
{
  vid.pause();
  if(t==1)
  {
    vid.src = files[0];
    currentVideoID = 0;
    vid.currentTime = 0;
  }
  else
  { 
    currentVideoID = files.length - 1;
    vid.src = files[currentVideoID];
    vid.currentTime = totalDuration - timeTable[currentVideoID] - 0.01;
  }
}

function pushToComment(t)
{
    var k = 0;
    var tt = timeTable[currentVideoID] + vid.currentTime;
    for (var i=0; i < currentCorrectionTimes.length; i++) {
      if(t==-1)
      {
        if(currentCorrectionTimes[i] > tt){
          moveToTime(currentCorrectionTimes[i]);
          break;
        }
      }
      else
      {
        if(currentCorrectionTimes[i] >= tt){
          moveToTime(k);
          break;
        }
        k = currentCorrectionTimes[i];        
      }
    }
    if(!vid.paused)
      isPaused = true;
  vid.pause();
  isCommentClicked = 2;
  currentCommentTime = timeTable[currentVideoID] + vid.currentTime;
}

function pushFrame(t)
{
  var nt;
  if(t==1)
  {
    nt = vid.currentTime - 0.04167;
  }
  else
  {
    nt = vid.currentTime + 0.04167;
  }
  vid.currentTime = nt;
  if(nt < 0)
  {
    currentVideoID--;
    if(currentVideoID < 0)
    {  
      currentVideoID = files.length -1;
      vid.src = files[currentVideoID];
      vid.currentTime = totalDuration - timeTable[currentVideoID] - 0.04167;
    }
    vid.src = files[currentVideoID];
    vid.currentTime = timeTable[currentVideoID + 1] - timeTable[currentVideoID] - 0.04167;
  }
  else if(nt > vid.duration)
  {
    currentVideoID++;
    if(currentVideoID > files.length - 1)
      currentVideoID = 0;
    vid.src = files[currentVideoID];
    vid.currentTime = 0.04167;
  }
  vid.pause();
}

function changeTool(ele)
{
  toolMode = ele.getAttribute('data-toolid');
  document.getElementsByClassName("selection")[0].className = "tool";
  ele.className = "tool selection";
  if(toolMode == 1)
  {
    document.getElementById("DrawingCanvas").style.cursor = "default";
    cursor.display = "none";

  }
  else
  {
    pause();
    document.getElementById("DrawingCanvas").style.cursor = "none";
    cursor.display = "block";
  }
}

function undo()
{
  if(currentQueueID >= 1)
  {
    currentQueueID--;
    setCanvasState();
  }
}

function redo()
{
  if(currentQueueID < queue.length-1)
  {
    currentQueueID++;
    setCanvasState();
  }
}

function playToggle()
{
  if(vid.paused){
    vid.play();
  }
  else{
    vid.pause(); 
  }
}

function pause()
{
 vid.pause();
}

function opacityChanged(ele)
{
  ctx.globalAlpha = ele.value/100;
}

function sizeChanged(ele)
{
  brushSize = ele.value/2;
  savePrefs();
}

function increaseBrushSize()
{
  var ele = document.getElementById("sizeRange");
  ele.value = parseFloat(ele.value) + 50;
  brushSize = ele.value/2;
  cursor.width = brushSize/3.5+2 + "px";
  cursor.height = brushSize/3.5+2 + "px";
  savePrefs();
}

function decreaseBrushSize()
{ 
  var ele = document.getElementById("sizeRange");
  ele.value -= 50;
  brushSize = ele.value/2;
  cursor.width = brushSize/3.5+2 + "px";
  cursor.height = brushSize/3.5+2 + "px";
  savePrefs();
}

function Fill()
{
  if(!vid.paused){
    vid.pause();return;
  }
  ctx.globalAlpha = 0.1;
  ctx.globalCompositeOperation="source-over";
  ctx.fillRect(0, 0, canvas.width, canvas.height);captureCanvasState();
  ctx.globalAlpha = 1;
}

function Clear()
{
  if(!vid.paused)
    vid.pause();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if(corrections[timetable[currentVideoID] + vid.currentTime])
    captureCanvasState();
}

function addFxToVideo()
{
  document.getElementById("flipBtn").className = "tool right " + (videoFlip? "selection" :"");
  document.getElementById("bwBtn").className = "tool right " + (videoBW? "selection" :"");
  document.getElementById("video").className = (videoFlip? "flipHorizontal " :"") + (videoBW? "bw " :"");
}

function showPrefs()
{
  pop("Opening Preferences");
  document.getElementsByClassName("prefInputs")[0].value = fps;
  document.getElementsByClassName("prefInputs")[1].value = tags[0];
  document.getElementsByClassName("prefInputs")[2].value = tags[1];
  document.getElementsByClassName("prefInputs")[3].value = tags[2];
  document.getElementsByClassName("prefInputs")[4].value = tags[3];
  prefWindow.style.display = "block";
}

function updatePrefs()
{
  fps = document.getElementsByClassName("prefInputs")[0].value;
  tags[0] = document.getElementsByClassName("prefInputs")[1].value;
  tags[1] = document.getElementsByClassName("prefInputs")[2].value;
  tags[2] = document.getElementsByClassName("prefInputs")[3].value;
  tags[3] = document.getElementsByClassName("prefInputs")[4].value;
}

