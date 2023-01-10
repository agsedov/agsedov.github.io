'use strict';
//import "https://unpkg.com/qrcode-generator@1.4.4/qrcode.js";

const e = React.createElement;

function RNG(seed) {
  // LCG using GCC's constants
  this.m = 0x80000000; // 2**31;
  this.a = 1103515245;
  this.c = 12345;

  this.state = seed ? seed : Math.floor(Math.random() * (this.m - 1));
}
RNG.prototype.nextInt = function() {
  this.state = (this.a * this.state + this.c) % this.m;
  return this.state;
}
var rng;
class RandomPicker {
  constructor(list, rng_state) {
    this.list = list;
    rng = new RNG();
    if(rng_state) {
      console.log("1",rng_state);
      rng.state = rng_state;
    } else {
      console.log("2",rng_state);
      this.rng_state = rng.nextInt();
    }
  }

  pickRandom = (ar) => {
    var l = ar.length;
    var n = rng.nextInt()%l; //Math.floor((Math.random() * l));
    return ar[n];
  }
  pickThemeAndTheorem = (i) => {
    //var half = this.list;
    var theorems = [];
    this.list.forEach((t)=>{
      t.items.forEach((item)=>{
        if(item.difficulty == 'hard' || item.difficulty == 'moderate') {
          theorems.push(item.name);
        }
      });
    });
    var theme = JSON.parse(JSON.stringify(this.pickRandom(this.list)));
    //return;
    var items = theme.items;
    if(theme.items.length > 9) { //Если в теме больше 9 вопросов - поделить на 2
      var newL = Math.ceil(theme.items.length/2);
      var pickFromBegin = (rng.nextInt()%2 > 0);
      if(pickFromBegin) {
        items.slice(newL);
      } else {
        items.slice(-newL);
      }
    } else {
      items = theme.items;
    }
    while(items.length > 5) {
      var r = rng.nextInt() % items.length;
      items.splice(r , 1);
    }
    return {
      "name" : theme.name,
      "items": items,
      "theorem": this.pickRandom(theorems),
      "rng_state": this.rng_state
    }
  }

  pickOneTheme() {
    var p1 = this.pickThemeAndTheorem(1);
    return [p1];
  }
}

class Question extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        var title, mark, glossaryEntry, theorem, alg = false;
        if(this.props.question.type == 'alg') {
          title = 'Знать алгоритм';
          alg = true;
        } else if(this.props.question.type == 'def') {
          title = 'Привести определение';
        } else if(this.props.question.type == 'th' && this.props.question.difficulty) {
          title = 'Доказательство может идти отдельным вопросом';
          mark = true;
          theorem = true;
        } else {
          theorem = true;
          title = 'Привести доказательство';
        }
        if(this.props.question.glossary) {
          glossaryEntry = this.props.question.glossary;
        }
      var element_class = "e-question"+(theorem?" theorem_el":"")+(alg?" alg_el":"");
      return e('li', {class: element_class, title:title},

          [
            mark? e('div',{class:'need-proof'},'💎') :'',
            glossaryEntry? e('a',{
                                    href:'https://moodle.uniyar.ac.ru/mod/glossary/showentry.php?eid='+glossaryEntry,
                                    target:'_blank'
                                  },this.props.question.name) :this.props.question.name,

          ]);
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

class TicketQuestion extends React.Component {
  prefixed(question) {
    if(question.type == 'def'){
      return 'Привести определение: ' + question.name;
    }

    if(question.type == 'th' && question.difficulty) {
      return 'Привести формулировку теоремы: ' + question.name;
    }

    if(question.type == 'th') {
      return 'Сформулировать и доказать теорему: ' + question.name;
    }

    if(question.type == 'alg') {
      return 'Описать алгоритм: ' + question.name;
    }
  }
  render() {
    return [e('div',{className:"ticket"},
              e('h5', {className:"ticket-question"}, this.props.question.name),
              e('ul', {}, this.props.question.items.map(item => {
                return e('li', {}, this.prefixed(item))})),
              e('h5', {className:"ticket-question"}, "Сформулировать и доказать теорему: " + this.props.question.theorem),
    )];
  }
}

class Ticket extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidUpdate() {
    if(typeof MathJax !== 'undefined') {
      MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
    }
  }
  render() {
    if(this.props.questions[0]) {
      return [e(TicketQuestion,{question: this.props.questions[0]})];
    } else {
      return null;
    }
  }
}

function httpGetAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous
    xmlHttp.send(null);
}

function getQuestionsAsync() {
  var json = window['json-url'];

  httpGetAsync(json, (text) => {
      var event = new CustomEvent('themes-loaded', { detail: text });
      document.dispatchEvent(event);
  });
}

class ThemeList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    document.addEventListener('themes-loaded', (e)=>{
      this.setState({list: JSON.parse(e.detail).themes});
    });
    getQuestionsAsync();
  }
  componentDidUpdate() {
    if(typeof MathJax !== 'undefined') {
      MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
    }
  }

  render() {
    if(this.state.list) {
        return [
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

class RandomTicket extends React.Component {
  constructor(props) {
    super(props);
    this.state = {questions: []};
  }
  componentDidMount() {
    document.addEventListener('themes-loaded', (e)=>{
      this.setState({list: JSON.parse(e.detail).themes});
      this.regen();
    });
    getQuestionsAsync();
  }
  regen(){
    var rng_state = location.hash?Number.parseInt(location.hash.substring(1)):false;
    var r = new RandomPicker(this.state.list, rng_state);
    var theme = r.pickOneTheme();
    rng_state = theme[0].rng_state;
    var typeNumber = 0;
    var errorCorrectionLevel = 'H';
    var qr = qrcode(typeNumber, errorCorrectionLevel);
    var data = location.hash?location.href:(location.href + "#" + rng_state);
    qr.addData(data);
    qr.make();
    var qr_tag = qr.createImgTag();
    this.setState({questions: theme});
    this.refs.test.innerHTML = qr_tag;
  }
  render () {
    return [,
        e(  'div',{className:"col-md-4 btn-wr"},
          e(
              'div',
              { onClick: () => this.regen(),
                className: "btn btn-primary btn-lg",
                style: { 'margin-left': '42%'}
              }, 'Случайный билет'
          )),
      e("div",{class:"ticket_outer"},
        e("div", {contentEditable:'true', ref:'test'},),
        e(Ticket, {questions: this.state.questions}),
      )
    ];
  }
}

const domContainer = document.querySelector('#themes_container');
if(domContainer) {
  ReactDOM.render(e(ThemeList), domContainer);
}

const ticketContainer = document.querySelector('#random_ticket');
if(ticketContainer) {
  ReactDOM.render(e(RandomTicket), ticketContainer);
}
