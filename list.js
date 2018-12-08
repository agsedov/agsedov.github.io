'use strict';

const e = React.createElement;

class RandomPicker {
  constructor(list) {
    this.list = list;
  }

  getHalf(i) {
    return this.list.filter(e => e.h === i);
  }

  pickRandom(ar) {
    var l = ar.length;
    var n = Math.floor((Math.random() * l));
    return ar[n];
  }
  pickThemeAndTheorem(i) {
    var half = this.getHalf(i);
    var theorems = [];
    half.forEach((t)=>{
      t.items.forEach((i)=>{
        if(i.difficulty == 'hard' || i.difficulty == 'moderate') {
          theorems.push(i.name);
        }
      });
    });
    
    var theme = this.pickRandom(half);
    var themeName = theme.name;
    var items;
    if(theme.items.length > 9) { //Если в теме больше 9 вопросов - поделить на 2
      var newL = Math.ceil(theme.items.length/2);
      var pickFromBegin = (Math.random() > 0.5);
      if(pickFromBegin) {
        items = theme.items.slice(newL);
      } else {
        items = theme.items.slice(-newL);
      }
    } else {
      items = theme.items;
    }
    return {
      "name" : theme.name,
      "items": items,
      "theorem": this.pickRandom(theorems)
    }
  }

  pickTwoThemes() {
    var p1 = this.pickThemeAndTheorem(1);
    var p2 = this.pickThemeAndTheorem(2);
    console.log(p1);
    console.log(p2);
  }
}

class Question extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return e('li', {class: 'e-question'}, this.props.question.name);
    }
}
class Theme extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return  e('li', {class: 'e-theme'},
                    [   
                        this.props.theme.link?
                            e('a',{href: this.props.theme.link}, this.props.theme.name)
                            :
                            e('b',{}, this.props.theme.name),
                        e('ol',{},
                        this.props.theme.items.map(item => 
                            e(Question,{question: item})
                        ))
                    ]
                );
    }
}
class ThemeList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  httpGetAsync(theUrl, callback)
  {
      var xmlHttp = new XMLHttpRequest();
      xmlHttp.onreadystatechange = function() { 
          if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
              callback(xmlHttp.responseText);
      }
      xmlHttp.open("GET", theUrl, true); // true for asynchronous 
      xmlHttp.send(null);
  }
  componentDidMount() {
    var json = window['json-url'];
    this.httpGetAsync.bind(this);
    this.httpGetAsync(json, (text) => {
        this.setState({list: JSON.parse(text).themes});
    });
  }
  componentDidUpdate() {
    MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
  }

  regen(){
    var r = new RandomPicker(this.state.list);
    r.pickTwoThemes();
  }
  render() {
    if(this.state.list) {
        return [
        e(
            'div',
            { onClick: () => this.regen() }, 'Случайный билет'
        ),
        e(
            'div', {},
            this.state.list.map((theme)=>
                e(Theme,{theme: theme})
            )
        )];
    } else {
        return e(
                'div',{},'Загрузка'
            );
    }
  }
}
const domContainer = document.querySelector('#themes_container');
ReactDOM.render(e(ThemeList), domContainer); 
