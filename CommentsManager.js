function updateCurrentComment()
{
  if(vid.currentTime != timeTable[currentVideoID] && vid.currentTime != timeTable[currentVideoID] + vid.duration)
  {
    isVisDataUpdated = true;
    newCommentClicked();
    corrections[timeTable[currentVideoID] + vid.currentTime].visData = canvas.toDataURL();
    isVisDataUpdated = false;
    updateComments();
  }
}

function textAreaAdjust(o) {
  o.style.height = "1px";
  o.style.height = (10+o.scrollHeight)+"px";
  reReadScrolls();
  updateScrolls();
  corrections[o.parentElement.dataset.time].txtData = o.value;
} 

function reAlignTags()
{  
  document.getElementById("commentStart").style.marginTop = (leftPart.offsetHeight*0.94)/2 - 105 + "px";
  document.getElementById("commentEnd").style.marginBottom = (leftPart.offsetHeight*0.94)/2 - 25 + "px";
}

function changeCategClicked(c)
{
  categFlag = c.value;
  updateComments();
}

function reReadScrolls()
{
  currentScrolls = [];
  currentScrolls.push(0);
  for (var i = 0; i < currentCorrectionTimes.length-2; i++) {
    currentScrolls.push(cmtsCont.children[i + 1].offsetTop - cmtsCont.children[0].offsetTop + 8); 
  }
  currentScrolls.push(cmtsCont.children[currentCorrectionTimes.length-1].offsetTop - cmtsCont.children[0].offsetTop); 
}

function iniCorrections()
{
  corrections = {};
  correctionTimes = [];
  correctionTimes.push(0);
  correctionTimes.push(totalDuration);
  currentScrolls = [];
  currentCorrectionTimes = [];
}

function updateComments()
{ 
  var p,c,d,dd;
  dd = totalDuration;
  d = "";
  p=c=0;
  cmtsCont.style.scrollBehavior = "auto";
  currentCorrectionTimes = [];
  var cmtsStr = "<div id='commentStart' data-time='0' onclick='commentClicked(this)'>START</div>";
  currentCorrectionTimes.push(0);
  for (var i = 1; i < correctionTimes.length-1; i++) {
    var tmp = corrections[correctionTimes[i]];
    if(( (categFlag == 0) || (categFlag&tmp.category) == 8 || (categFlag&tmp.category) == 4 || (categFlag&tmp.category) == 2 || (categFlag&tmp.category) == 1))
    {
        if(tmp.corrected)
        {
          c++;
        }
        else
        {
          p++;
        }
      if(typeFlag == tmp.corrected)
      {
        var isNew = "";
        var extraCmtCss = "";
        if(newCommentTimecode == correctionTimes[i] && newCommentTimecode != 0)
        {
          isNew = "newCmt";
          newCommentTimecode = 0;
        }
        currentCorrectionTimes.push(correctionTimes[i]);
        d+="<div class='cmtVis' style='left:"+(correctionTimes[i]/totalDuration)*100+"%;''></div>"
        cmtsStr += "<div class='comment "+ isNew +"' data-time='"+correctionTimes[i]+"' onclick='commentClicked(this)'>"+
        "<div class='commentTag "+ (((tmp.category&8) == 8)? "tagSelected" : "") +"' onclick='categClicked(this,8)'>"+tags[0]+"</div>"+
        "<div class='commentTag "+ (((tmp.category&4) == 4)? "tagSelected" : "") +"' onclick='categClicked(this,4)'>"+tags[1]+"</div>"+
        "<div class='commentTag "+ (((tmp.category&2) == 2)? "tagSelected" : "") +"' onclick='categClicked(this,2)'>"+tags[2]+"</div>"+
        "<div class='commentTag "+ (((tmp.category&1) == 1)? "tagSelected" : "") +"' onclick='categClicked(this,1)'>"+tags[3]+"</div>"+
        "<div class='commentTimecode'>"+setTimeCode(parseFloat(correctionTimes[i]))+"</div>"+
        "<div class='commentImgTag' style='display:"+ ((tmp.visData == emptyImg)? "none":"block") +"'></div>"+
        "<textarea onload='textAreaAdjust(this)' onfocus = 'isTyping=true;' onblur = 'isTyping = false;' onkeyup='textAreaAdjust(this)' class='commentDec'>"+tmp.txtData+"</textarea>"+
        "<div class='commentBtn "+ ((tmp.corrected == true)? "correctedCmt":"") +"' onclick='TaskStatusChanged(this)'>"+((tmp.corrected == true)? "REASSIGN":"CORRECTED")+"</div>"+
        "<div class='commentDelete' onclick='commentDeleteClicked(this)'>X</div></div>";
      }
    }
  }
  document.getElementById("pendingno").innerHTML = p;
  document.getElementById("completedno").innerHTML = c;
  document.getElementById("commentVisData").innerHTML = d;
  cmtsStr += "<div id='commentEnd' data-time='"+totalDuration+"'  onclick='commentClicked(this)'>END</div>";
  currentCorrectionTimes.push(totalDuration);
  cmtsCont.innerHTML = cmtsStr;
  var tas = document.getElementsByTagName("textarea");
  for (var i = 0; i < tas.length; i++) {
    tas[i].style.height = "1px";
    tas[i].style.height = (10+tas[i].scrollHeight)+"px";
  }
  reAlignTags();
  reReadScrolls();
  updateScrolls();
  document.getElementById("tag1").innerHTML = tags[0];
  document.getElementById("tag2").innerHTML = tags[1];
  document.getElementById("tag3").innerHTML = tags[2];
  document.getElementById("tag4").innerHTML = tags[3];
}

function changeTypeClicked(c)
{
  if(c==0)
  {
    typeFlag = 0;
    document.getElementById("tab1").className = "tabs tabSelected";
    document.getElementById("tab2").className = "tabs";
  }
  else
  {
    typeFlag = 1;
    document.getElementById("tab1").className = "tabs";
    document.getElementById("tab2").className = "tabs tabSelected";
  }
  updateComments();
}

function newCommentClicked()
{
  if(!correctionTimes.includes(timeTable[currentVideoID] + vid.currentTime))
  {
    changeTypeClicked(0);
    var tmp = new correction(categFlag,emptyImg,"",false);
    corrections[timeTable[currentVideoID] + vid.currentTime] = tmp;
    correctionTimes.push(timeTable[currentVideoID] + vid.currentTime);
    newCommentTimecode = timeTable[currentVideoID] + vid.currentTime;
    correctionTimes.sort(function(a, b){return a - b});
    if(!isVisDataUpdated)
  		updateComments();
  }
}

function commentDeleteClicked(t)
{
	if(t.innerHTML == "X")
		t.innerHTML = "GO";
	else if(t.innerHTML == "GO")
		t.innerHTML = "Del";
	else
	{
		var tm = t.parentElement.dataset.time;
		var i = correctionTimes.indexOf(parseFloat(tm));
		delete corrections[correctionTimes[i]];
		correctionTimes.splice(i,1);
		updateComments();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
	}
}

function TaskStatusChanged(t)
{
	corrections[t.parentElement.dataset.time].corrected = !typeFlag;
	updateComments();
  //ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function commentClicked(c)
{
  var t = c.dataset.time;
  isCommentClicked = true;
  currentCommentTime = t;
  cmtsCont.style.scrollBehavior="smooth";
  if(cmtsCont.scrollTop == timeToScroll(t))
    getVideoToAbsoluteTime(c.dataset.time);
  else
    cmtsCont.scrollTop = timeToScroll(t);
  if(!vid.paused)
  isPaused = true;
  vid.pause();
  isCommentClicked = 2;
}

function moveToTime(t)
{
  var tid = -1;
  for (var i = 0; i < timeTable.length ; i++) {
    if(timeTable[i] <= t)
      {tid++;}
    else
      {break;}
  }
  currentVideoID = tid;
  vid.src = files[currentVideoID];
  vid.currentTime = t - timeTable[currentVideoID];
}

function categClicked(e,n)
{
	var t = e.parentElement.dataset.time;
	if(corrections[t])
	{
		if((corrections[t].category & n) == n)
		{
			corrections[t].category -= n;
      e.className = "commentTag";
		}
		else
		{
			corrections[t].category += n;
      e.className = "commentTag tagSelected";
		}
	}
	//updateComments();
}

function updateScrolls()
{
  if(!skipScrollChange)
  {
      skipTimeChange = true;
      cmtsCont.scrollTop = timeToScroll(timeTable[currentVideoID] + vid.currentTime);
  }
  else
  {
    skipScrollChange = false;
  }
}