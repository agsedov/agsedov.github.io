'use strict';

const e = React.createElement;

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
    console.log('Child did mount.');
    var json = window['json-url'];
    this.httpGetAsync.bind(this);
    this.httpGetAsync(json, (text)=>{
        this.setState({list: JSON.parse(text).themes});
    });
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
