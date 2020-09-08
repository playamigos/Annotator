function setCanvasState()
{
  var canvasPic = new Image();
  canvasPic.src = queue[currentQueueID];
  canvasPic.onload= function(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation="source-over";
    ctx.globalAlpha = 1;
    ctx.drawImage(canvasPic, 0, 0);
    ctx.globalAlpha = document.getElementById("opacityRange").value/100;
    updateCurrentComment();
  }
}

function captureCanvasState()
{
  if(currentQueueID != queue.length - 1)
  {
    queue.length = currentQueueID + 1;
  }
  currentQueueID = queue.length;
  queue[queue.length] = canvas.toDataURL();
  if(queue.length >maxUndos)
  {
    queue.splice(0,queue.length - maxUndos);
    currentQueueID -= queue.length -maxUndos + 1;
  }
  updateCurrentComment();
}