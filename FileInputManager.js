new Sortable.create(FilesContainer, {
  multiDrag: true,
  selectedClass: "selectedFile",
  animation: 150,
  removeCloneOnHide: true,
  onUpdate : function(event,ui){
    fileOrderChanged();
  }
});

function videoDropped(e)
{
  for(var i=0; i<e.dataTransfer.files.length; i++)
  {
    if(!files.includes(e.dataTransfer.files[i].path))
      files.push(e.dataTransfer.files[i].path);
  }
  iniVidVars();
  e.preventDefault();
  windowResized();
  RefreshFileList();
}

function iniVidVars()
{
  document.getElementsByClassName("control")[0].style.backgroundImage = "url('icons/play.png')";
  pop("Loading Videos");
  areVideosLoading = true;
  totalDuration = 0;
  currentVideoID = 0;
  timeTable = [];
  vid.src = encodeVideoURL(files[0]);
  vid.load();
}

function RefreshFileList()
{
  FilesContainer.innerHTML = "";
  for(var i = 0; i < files.length; i++)
  {
    var fname = files[i].substring(files[i].lastIndexOf('\\')+1);
    fname = shortenFileName(fname);
    var html = "<div class='FileHolder' data-path='"+ files[i] +"'><div class='FileNo'>"+ (i+1) +"</div><div class='FileName'>"+ fname +"</div></div>";
    FilesContainer.innerHTML += html;
  }
}

function sortFilesAlphabetically(order)
{
  fullReset();
  files.sort(function (a, b) {
    if (a.substring(a.lastIndexOf('\\')+1) > b.substring(b.lastIndexOf('\\')+1)) {
        return 1*order;
    }
    if (b.substring(b.lastIndexOf('\\')+1) > a.substring(a.lastIndexOf('\\')+1)) {
        return -1*order;
    }
    return 0;
  });
  RefreshFileList();
  pop("Files Sorted");
  iniVidVars();
}

function fileOrderChanged()
{
  fullReset();
  files = [];
  var nodes = FilesContainer.childNodes;
  for(var i = 0; i < nodes.length; i++)
  {
    nodes[i].childNodes[0].innerHTML = i+1;
    files.push(nodes[i].dataset.path);
  }
  pop("Files Reordered");
  iniVidVars();
}

function clearAllFiles()
{
  fullReset();
  files = [];
  RefreshFileList();
  vid.src = "";
  totalDuration = 0;
  currentVideoID = 0;
  timeTable = [];
}

function ToggleFileSelect(e)
{
  e.stopPropagation();
  if(e.target.className == "FileHolder")
  {
    e.target.className = "FileHolder selectedFile";
    selectedFiles.push(e.target.dataset.path);
  }
  else
  {
    e.target.className = "FileHolder";
  }
}

function openFileDialogue()
{
  fullReset();
  var input = document.createElement('input');
  input.multiple = true;
  input.type = 'file';
  input.accept = "video/*";
  input.oninput = e => { 
    for(var i=0; i<e.target.files.length; i++)
    {
      if(!files.includes(e.target.files[i].path))
        files.push(e.target.files[i].path);
    }
    iniVidVars();
    windowResized();
    RefreshFileList();
  }
  input.click();
}


AddFilesBtn.onclick = () => {
  openFileDialogue();
}

