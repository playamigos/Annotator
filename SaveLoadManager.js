//initialising methods
function checkForFile()
{  
  pop("Checking Files");
  for (var i = files.length - 1; i >= 0; i--) {
    filePath = files[i];
    folderPath = path.dirname(filePath);
    fileName = path.basename(filePath);
    fileName = fileName.replace("\.","")+".json";
    if(!fs.existsSync(folderPath+"/.review"+"/"+fileName))
    {
      createFile();
    }
  }  
  loadCorrections(0);
}

function createFile()
{
  pop("Creating Files");
	if(!fs.existsSync(folderPath+"/.review"))
	{
  		fs.mkdir(folderPath+"/.review",function(err){
   		if (err) {
       		return console.error(err);
   		}
		});
  	}
  	fs.writeFile(folderPath+"/.review/"+fileName, '', function (err) { 
                        if (err)
        console.log(err);
                        else
        console.log('Write operation complete.');
	});
	// iniCorrections();
}

//Preferences related methods
function savePrefs()
{  
  pop("Saving Preferences");
  var prefs = new config(
    fps,
    document.getElementsByClassName('colorPick')[0].dataset.color,
    document.getElementsByClassName('colorPick')[1].dataset.color,
    document.getElementsByClassName('colorPick')[2].dataset.color,
    document.getElementsByClassName('colorPick')[3].dataset.color,
    document.getElementsByClassName('colorPick')[4].dataset.color,
    document.getElementsByClassName('colorPick')[5].dataset.color,
    brushSize,
    tags[0],
    tags[1],
    tags[2],
    tags[3],
    rightPart.offsetWidth,
    FilesSection.offsetWidth
    );
  var prefsJson = JSON.stringify(prefs);
  fs.writeFile("config.json", prefsJson, function (err) { 
        if (err)
          console.log(err);
        else{
          pop("Preferences saved");
          prefWindow.style.display = "none";
          updateComments();
        }
  });
}

function loadPrefs()
{
  pop("Loading Preferences");
  var prefs;
  fs.readFile( "config.json" , function (err, data) {
  if (err) {
    throw err; 
  }
  else
  {
    if(data.toString() != "")
    {
     prefs = JSON.parse(data.toString());
     fps = prefs.fps;

     document.getElementsByClassName('colorPick')[0].dataset.color = prefs.color1;
     document.getElementsByClassName('colorPick')[0].style.backgroundColor = prefs.color1;
     document.getElementsByClassName('colorPick')[1].dataset.color = prefs.color2;
     document.getElementsByClassName('colorPick')[1].style.backgroundColor = prefs.color2;
     document.getElementsByClassName('colorPick')[2].dataset.color = prefs.color3;
     document.getElementsByClassName('colorPick')[2].style.backgroundColor = prefs.color3;
     document.getElementsByClassName('colorPick')[3].dataset.color = prefs.color4;
     document.getElementsByClassName('colorPick')[3].style.backgroundColor = prefs.color4;
     document.getElementsByClassName('colorPick')[4].dataset.color = prefs.color5;
     document.getElementsByClassName('colorPick')[4].style.backgroundColor = prefs.color5;
     document.getElementsByClassName('colorPick')[5].dataset.color = prefs.color6;
     document.getElementsByClassName('colorPick')[5].style.backgroundColor = prefs.color6;

     brushSize = prefs.brushSize;
     document.getElementById("sizeRange").value = 2*brushSize;

     tags[0] = prefs.tag1;
     tags[1] = prefs.tag2;
     tags[2] = prefs.tag3;
     tags[3] = prefs.tag4;

     rightPart.style.width = prefs.width + "px";
     FilesSection.style.width = prefs.width2 + "px";
     windowResized();
    }
  }
  });
}

//Corrections related methods
function saveCorrections()
{
  pop("Saving Corrections");
  for (var j = 0; j < files.length; j++) {
    
    filePath = files[j];
    folderPath = path.dirname(filePath);
    fileName = path.basename(filePath);
    fileName = fileName.replace("\.","")+".json";

	   var corr = {};
      for (var i = 1; i < correctionTimes.length-1; i++) {
        if(correctionTimes[i] > timeTable[j] && (correctionTimes[i] < timeTable[j+1] || j==files.length-1))
        {
  	     corr[correctionTimes[i] - timeTable[j]] = JSON.stringify(corrections[correctionTimes[i]]);
        }
      }
      var allCorrectionJSON = JSON.stringify(corr);
      fs.writeFile(folderPath+"/.review/"+fileName, allCorrectionJSON, function (err) { 
        if (err)
        	console.log(err);
        else
        	console.log("saved");
	   });
  }
}

function loadCorrections(i)
{
  pop("Loading Corrections");   
    filePath = files[i];
    folderPath = path.dirname(filePath);
    fileName = path.basename(filePath);
    fileName = fileName.replace("\.","")+".json";
    
    var corr = {};
    fs.readFile( folderPath+"/.review/"+fileName , function (err, data) {
      if (err) {
        throw err; 
      }
      else
      { if(i==0)
        {          
          iniCorrections();
        }
        if(data.toString() != "")
        {
  	       corr = JSON.parse(data.toString());
  	       for(var k in corr)
  	       {
  		        corrections[timeTable[i] + parseFloat(k)] = JSON.parse(corr[k]);
  		        correctionTimes.push(timeTable[i] + parseFloat(k));
              correctionTimes.sort(function(a, b){return a - b});
  	       }
        }
        i++;
        if(i < files.length)
        {
          loadCorrections(i);
          return;
        }
        else
        {
  	      updateComments();
        }
      }
    });
}

//export related methods
function iniExport()
{
  if(!fs.existsSync(folderPath+"/Export"))
  {
      fs.mkdir(folderPath+"/Export",function(err){
        if (err) {
          return console.error(err);
        }
      });
  }
  exportID = 1;
  isExporting = true;
  vid.pause();
  getVideoToAbsoluteTime(currentCorrectionTimes[exportID]);
}

function uniExport()
{  
  pop("Exporting Current Frame");
  if(!fs.existsSync(folderPath+"/Export"))
  {
      fs.mkdir(folderPath+"/Export",function(err){
        if (err) {
          return console.error(err);
        }
      });
  }
  exportID = 1;
  isExporting = true;
  isUniExport = true;
  vid.pause();
  getVideoToAbsoluteTime(currentTime + 0.001);
  getVideoToAbsoluteTime(currentTime - 0.001);
}

function exportCorrections()
{
  pop("Exporting All");
  var canv = document.getElementById('ExportCanvas');
  var c = canv.getContext('2d');
  var img;
    c.fillStyle = "#FFFFFF";
    c.fillRect(0, 0, 2220, 1080);
    c.fillStyle = "#111";
    c.fillRect(1920, 0, 300, 1080);
    c.drawImage(vid, 0, 0, 1920, 1080);
    c.fillStyle = "#FF0000";
    c.font = "40px Tahoma"; 
    c.fillText(setTimeCode(currentCorrectionTimes[exportID]), 1995, 50);
    c.fillStyle = "#FFF";
    c.font = "17px Tahoma"; 
    wrapText(c,corrections[currentCorrectionTimes[exportID]].txtData , 1940, 90, 260, 20);
    
    var canvasPic = new Image();
    if(!isUniExport)
    {
    if(corrections[currentCorrectionTimes[exportID]].visData != "")
    {
      canvasPic.src = corrections[currentCorrectionTimes[exportID]].visData;
    }
    else
    {
      canvasPic.src = emptyImg;
    }
    }
    else
    {
      if(corrections[currentTime])
      {
        canvasPic.src = corrections[currentTime].visData;
      }
      else
      {
         canvasPic.src = emptyImg;
      }
    }
    canvasPic.onload= function(){
      c.globalCompositeOperation="source-over";
      c.globalAlpha = 1;
      c.drawImage(canvasPic, 0, 0, 1920,1080);
      img = canv.toDataURL().replace(/^data:image\/\w+;base64,/, "");
      var buf = new Buffer.from(img, 'base64');
      fs.writeFile(folderPath+"/Export/"+exportID+".png", buf, function (err) { 
      if (err)
        console.log(err);
      else
        console.log("Exported");
       if(!isUniExport)
       {
        exportID++;
        if(exportID < currentCorrectionTimes.length-1)          
          getVideoToAbsoluteTime(currentCorrectionTimes[exportID]);
        else
        {
          isExporting = false;          
          getVideoToAbsoluteTime(0);
          require('child_process').exec('start "" '+folderPath+'"/Export/"');
        }
       }
       else
       {
        isUniExport = false;
        isExporting = false;
        require('child_process').exec('start "" '+folderPath+'"/Export/"');
       } 
      });
    }
}

function wrapText(context, text, x, y, maxWidth, lineHeight) {
      var lines = text.split('\n');
      for(var m = 0; m < lines.length; m++)
      {
        var words = lines[m].split(' ');
        var line = '';

        for(var n = 0; n < words.length; n++) {
          var testLine = line + words[n] + ' ';
          var metrics = context.measureText(testLine);
          var testWidth = metrics.width;
          if (testWidth > maxWidth && n > 0) {
            context.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
          }
          else {
            line = testLine;
          }
        }
        context.fillText(line, x, y);        
        y += lineHeight;
      }
}
