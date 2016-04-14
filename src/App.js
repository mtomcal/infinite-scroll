import React from 'react';
import WorkerFacade from './workerFacade';
import _ from 'lodash';

const WEB_WORKER = 'dist/worker.js';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            worker: {},
            page: 1
        }
    }
    getData() {
        this.worker.post({type: 'LOAD_INFO', page: this.state.page});
        this.setState({page: this.state.page + 1})
    }
    onMessage(state) {
        setTimeout(() => {
            this.setState({worker: state});
        }, 1);
    }
    componentWillMount() {
        this.worker = new WorkerFacade(WEB_WORKER);
        this.unsub = this.worker.listen(this.onMessage.bind(this));
    }
    componentWillUnmount() {
        this.worker = null;
        this.unsub();
    }
    renderItems() {
        var items = _.get(this, 'state.worker.albums');
        if (_.isEmpty(items)) {
            return;
        }
        return items
            .filter(function (item) {
                return _.get(item, 'name');
            })
            .map(function (item, index) {
                return <li className='item' key={`item-${index}`}>
                    <img className={`image-component`} src={_.get(item, 'images[1].url')} />
                    <span>{item.name}</span>
                </li>;
            })
    }
    render() {
        // console.log(this.state);
        return <div>
            <button onClick={this.getData.bind(this)}>Get Data</button>
            <ul className='container'>
                {this.renderItems()}
            </ul>
        </div>;
    }
}