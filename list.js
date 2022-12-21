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
      t.items.forEach((item)=>{
        if(item.difficulty == 'hard' || item.difficulty == 'moderate') {
          theorems.push(item.name);
        }
      });
    });
    var theme = Object.assign({}, this.pickRandom(half));
    var themeName = theme.name;
    var items = theme.items;
    if(theme.items.length > 9) { //Если в теме больше 9 вопросов - поделить на 2
      var newL = Math.ceil(theme.items.length/2);
      var pickFromBegin = (Math.random() > 0.5);
      if(pickFromBegin) {
        items.slice(newL);
      } else {
        items.slice(-newL);
      }
    } else {
      items = theme.items;
    }
    while(items.length > 5) {
      var r = Math.floor(Math.random() * items.length);
      items.splice(r , 1);
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
    return [p1, p2];
  }
}

class Question extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        var title, mark, glossaryEntry = false;
        if(this.props.question.type == 'alg') {
          title = 'Знать алгоритм';
        } else if(this.props.question.type == 'def') {
          title = 'Привести определение';
        } else if(this.props.question.type == 'th' && this.props.question.difficulty) {
          title = 'Доказательство может идти отдельным вопросом';
          mark = true;
        } else {
          title = 'Привести доказательство';
        }
        if(this.props.question.glossary) {
          glossaryEntry = this.props.question.glossary;
        }
        return e('li', {class: 'e-question', title:title},
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
    return [e('h5', {className:"ticket-question"}, this.props.question.name + " [10 баллов]"),
            e('ul', {}, this.props.question.items.map(item => {
                return e('li', {}, this.prefixed(item))})),
            e('h5', {className:"ticket-question"}, "Сформулировать и доказать теорему: " + this.props.question.theorem + " [10 баллов]"),
            ];
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
      return [e(TicketQuestion,{question: this.props.questions[0]}),
              e(TicketQuestion,{question: this.props.questions[1]})];
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
    });
    getQuestionsAsync();
  }
  regen(){
    var r = new RandomPicker(this.state.list);
    this.setState({questions: r.pickTwoThemes()});
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
          ),
          e(Ticket, {questions: this.state.questions}))];
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
