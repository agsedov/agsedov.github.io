function httpGetAsync(theUrl, callback) {
  console.log(theUrl);
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
      callback(xmlHttp.responseText);
  }
  xmlHttp.open("GET", theUrl, true); // true for asynchronous
  xmlHttp.send(null);
}

function makeLine(coords, linkType) {
  return new fabric.Line(coords, {
    fill: linkType == "parent" ? 'red' : 'blue',
    stroke: linkType == "parent" ? 'red' : 'blue',
    strokeWidth: linkType == "parent" ? 3 : 1,
    selectable: false,
    evented: false,
  });
}

function RectWithText(left, top, textValue) {
  var text = new fabric.Text(textValue, {
    originX: 'center',
    originY: 'center',
    fontSize: 18,
    fill: 'black',
  });

  var rect = new fabric.Rect({
    originX: 'center',
    originY: 'center',
    width: 260,
    height: 70,
    fill: '#afd',
  });
  return new fabric.Group([rect, text], {
    left: left,
    top: top
  });
}


var canvas = new fabric.Canvas('canvas');

getQuestionsAsync = (jsonUrl) => {

  return new Promise((resolve, reject) => {
    console.log(jsonUrl);
    httpGetAsync(jsonUrl, (json) => {
      var themes = JSON.parse(json).themes;
      var questions = [];
      themes.map((theme) => {
        theme.items.map((element) => {
          if (element.id > 0) {
            questions.push(element);
          }
        });
      });
      resolve(questions);
    });
  });
};

links = [];
addLink = (start, end, linkType) => {
  if (!links[start]) {
    links[start] = [[], []];
  }
  if (!links[end]) {
    links[end] = [[], []];
  }
  links[start][0].push([end, linkType]);
  links[end][1].push([start, linkType]);

}
positions = [];

Promise.all([getQuestionsAsync('./questions-algebra.json'), getQuestionsAsync('./questions-geometry.json')]).then(values => {
  var allValues = values[0].concat(values[1]);

  allValues.map(element => {
    let left = (element.p) ? element.p.l : 100;
    let top = (element.p) ? element.p.t : 100;
    if (element.p) {
      positions[element.id] = element.p;
    }
    let rect = RectWithText(left, top, element.name);
    rect.appData = { id: element.id, parents: element.parents };
    if (element.parents) {
      element.parents.map((parent) => {
        addLink(parent, element.id, "parent");
      });
    }
    if (element.based) {
      element.based.map((parent) => {
        addLink(parent, element.id, "related");
      });
    }
    canvas.add(rect);
  });
  console.log(links);
  links.map((ObjectLinks, id) => {
    ObjectLinks[0].map(linkInfo => {
      let childId = linkInfo[0];
      let linkType = linkInfo[1];
      console.log(positions[id], positions[childId]);
      let line = makeLine([positions[id].l + 130, positions[id].t + 70, positions[childId].l + 130, positions[childId].t], linkType);
      canvas.add(line);
      canvas.sendToBack(line);
    });
  })
});

canvas.on('object:moving', function(e) {
  console.log(e.target.appData);
  console.log("top", e.target.top);
  console.log("left", e.target.left);
});
