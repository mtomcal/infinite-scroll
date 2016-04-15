import React from 'react';
import WorkerFacade from './workerFacade';
import _ from 'lodash';
import Infinite from 'react-infinite';

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
    componentDidMount() {
        // this.getData();
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
                return <div className='item' key={`item-${index}`}>
                    <img className={`image-component`} src={_.get(item, 'images[1].url')} />
                    <span>{item.name}</span>
                </div>;
            })
    }
    render() {
        // console.log(this.state);
        return <div>
            <Infinite className="container"
                      useWindowAsScrollContainer
                      elementHeight={310}
                      preloadBatchSize={3100}
                      onInfiniteLoad={this.getData.bind(this)}
                      preloadAdditionalHeight={Infinite.containerHeightScaleFactor(3)}
                      infiniteLoadBeginEdgeOffset={310*10}>
                {this.renderItems()}
            </Infinite>
        </div>;
    }
}