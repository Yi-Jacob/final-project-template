import React from 'react';
import queryString from 'query-string';
import Nav from '../components/navbar';
import Card from 'react-bootstrap/Card';

export default class Results extends React.Component {
  constructor(props) {
    super(props);
    this.state = ({
      address: queryString.parse(this.props.location.search).address,
      input: '',
      walletData: {
        chain_stats: {
          tx_count: 0,
          funded_txo_sum: 0,
          spent_txo_sum: 0
        }
      },
      transactionData: [
        {
          txid: '',
          status: {
            block_height: 0
          }
        },
        {
          txid: '',
          status: {
            block_height: 0
          }
        },
        {
          txid: '',
          status: {
            block_height: 0
          }
        }
      ]
    });
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    this.unlisten = this.props.history.listen((location, action) => {
      this.setState({ address: queryString.parse(location.search).address });
      this.fetchData(queryString.parse(location.search).address);
    });
    this.fetchData(this.state.address);
  }

  componentWillUnmount() {
    this.unlisten();
  }

  fetchData(address) {
    fetch(`https://mempool.space/api/address/${address}`)
      .then(res => res.json())
      .then(data => {
        this.setState({ walletData: data });
      });
    fetch(`https://mempool.space/api/address/${address}/txs`)
      .then(res => res.json())
      .then(data => {
        this.setState({ transactionData: data });
      });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.history.push('/search-results?address=' + this.state.input);
  }

  handleChange(event) {
    this.setState({ input: event.target.value });
  }

  // handleClick(event) {
  //   console.log('test');
  //   const { action } = this.props;
  //   const req = {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify(this.state)
  //   };
  // }
  // fetch('http://localhost:3001/api/bookmarks`', req)
  //   .then(res => res.json())
  handleClick(event) {
    // console.log('here');
    const baseURL = 'http://localhost:3001/api';

    fetch(`${baseURL}/bookmarks`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state)
    });
  }

  render() {
    return (
      <>
        <Nav history={this.props.history} onSubmit={this.handleSubmit} onChange={this.handleChange} value={this.state.input}/>
        <div className="container-fluid">
          <div className="row my-4 margin-right-10 margin-left-6">
            <div className='col-sm-9 col-md-11'>
              <p className='address-header font-titillium-web font-underline'>
                Search Address: {this.state.walletData.address}
                <button className='bookmark-btn' onClick={this.handleClick}>
                  <i className="fa-solid fa-star"></i>
                </button>
              </p>
            </div>
          </div>
          <div className="row my-4 margin-left-1 margin-right-1">
            <Card className='mb-3 orange-border font-titillium-web px-4 py-4 grey-background'>
              <div className="row">
                <div className="col-md-3 col-sm-10 px-1 justify-content-center margin-left-14">
                  <img className='black-border' src={`https://www.bitcoinqrcodemaker.com/api/?style=bitcoin&address=${this.state.address}`} alt="bitcoin QR code generator" height="250" width="275" />
                </div>
                <div className="col-md-7 col-sm-10 margin-left-1 px-0 justify-content-start align-self-center">
                  <Card.Title className='info-text'>Total Balance: {(this.state.walletData.chain_stats.funded_txo_sum - this.state.walletData.chain_stats.spent_txo_sum) / 100000000} BTC</Card.Title>
                  <Card.Title className='info-text'>Total Number of Transactions: {this.state.walletData.chain_stats.tx_count}</Card.Title>
                </div>
              </div>
            </Card>
          </div>
          <div className="row my-4 margin-left-1 margin-right-1 px-0 justify-content-center">
            <Card className='orange-border padding-zero font-size-20 grey-background'>
              <Card.Header className='mx-0 font-titillium-web font-bold'>Last 3 Transactions</Card.Header>
              <ul className='px-4 py-2'>
                <li>
                  <Card.Title>Transaction ID: {this.state.transactionData[0].txid}</Card.Title>
                  <ul>
                    <li>
                      <Card.Title>Block Height: {this.state.transactionData[0].status.block_height}</Card.Title>
                    </li>
                  </ul>
                </li>
                <li>
                  <Card.Title>Transaction ID: {this.state.transactionData[1].txid}</Card.Title>
                  <ul>
                    <li>
                      <Card.Title>Block Height: {this.state.transactionData[1].status.block_height}</Card.Title>
                    </li>
                  </ul>
                </li>
                <li>
                  <Card.Title>Transaction ID: {this.state.transactionData[2].txid}</Card.Title>
                  <ul>
                    <li>
                      <Card.Title>Block Height: {this.state.transactionData[2].status.block_height}</Card.Title>
                    </li>
                  </ul>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </>
    );
  }
}
