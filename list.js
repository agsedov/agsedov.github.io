'use strict';

const e = React.createElement;

class Question extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        var title, mark = false;
        if(this.props.question.type == 'alg') {
          title = 'Знать алгоритм';
        } else if(this.props.question.type == 'def') {
          title = 'Знать определение';
        } else if(this.props.question.type == 'th' && this.props.question.difficulty) {
          title = 'Доказательство может идти отдельным вопросом';
          mark = true;
        } else {
          title = 'Привести доказательство';
        }
        return e('li', {class: 'e-question', title:title}, 
          [
            mark? e('div',{class:'need-proof'},'!') :'',
            this.props.question.name
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
    if(typeof MathJax !== 'undefined') {
      MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
    }
  }
  render() {
    if(this.state.list) {
        return e(
            'div',
            { onClick: () => this.setState({ liked: true }) },
            this.state.list.map((theme)=>
                e(Theme,{theme: theme})
            )
        );
    } else {
        return e(
                'div',{},'Загрузка'
            );
    }
  }
}
const domContainer = document.querySelector('#themes_container');
ReactDOM.render(e(ThemeList), domContainer); 
