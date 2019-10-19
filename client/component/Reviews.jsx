import React from 'react';
import axios from 'axios';
import ReviewsList from './ReviewsList.jsx';
import Modal from 'react-modal';

const modalStyle = {
  content: {
    display: 'block',
    marginTop: '0',
    margin: '0 auto',
    width: '60%',
    height: '65%',
    background: 'black',
    color: '#696969',
    
  }
};

Modal.setAppElement('#app');

class Reviews extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      reviews: [],
      rendered: false,
      showModal: false,
      reviewImg: '',
      imgCaption: '',
      itemsToShow: 8
    }

    this.reviewStars = this.reviewStars.bind(this);
    this.reviewImgClick = this.reviewImgClick.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.sortByRelevance = this.sortByRelevance.bind(this);
    this.sortByMostHelpful = this.sortByMostHelpful.bind(this);
    this.sortByHighestToLowest = this.sortByHighestToLowest.bind(this);
    this.sortByLowestToHighest = this.sortByLowestToHighest.bind(this);
    this.renderMostRelevant = this.renderMostRelevant.bind(this);
  }

  componentDidMount(){
    this.getItemReviews(1);
  }

  sortByRelevance(e){
    this.sortByClick(e);
    let reviews = this.state.reviews;
    reviews.sort((a, b) => (b.helpful_yes + b.helpful_no) - (a.helpful_yes + a.helpful_no));
    this.setState({
      reviews: reviews
    })
  }

  sortByMostHelpful(e){
    this.sortByClick(e);
    let reviews = this.state.reviews;
    reviews.sort((a, b) => b.helpful_yes - a.helpful_yes);
    this.setState({
      reviews: reviews
    })
  }

  sortByHighestToLowest(e){
    this.sortByClick(e);
    let reviews = this.state.reviews;
    reviews.sort((a, b) => b.stars - a.stars);
    this.setState({
      reviews: reviews
    })
  }

  sortByLowestToHighest(e){
    this.sortByClick(e);
    let reviews = this.state.reviews;
    reviews.sort((a, b) => a.stars - b.stars);
    this.setState({
      reviews: reviews
    })
  }

  sortByClick(e){
    document.getElementById("currentSort").innerHTML = e.currentTarget.textContent;
  }

  renderMostRelevant(){
    this.state.reviews.sort((a, b) => (b.helpful_yes + b.helpful_no) - (a.helpful_yes + a.helpful_no));
    this.setState({
      rendered: true
    })
  }


  
  
  reviewStars(rating){
    if (rating === 5){
      return '★★★★★';
    } else if (rating === 4){
      return '★★★★☆';
    } else if (rating === 3) {
      return '★★★☆☆';
    } else if (rating === 2) {
      return '★★☆☆☆';
    } else {
      return '★☆☆☆☆';
    }
  }

  getItemReviews(id){
    axios.get(`/api/reviews/${id}`)
    .then((results) => {
      this.setState({
        reviews: results.data
      })
      this.renderMostRelevant();
      console.log(this.state.reviews)
    })
    .catch((err) => console.error(`Unsuccessful getItemReviews request: ${err}`))
  }

  reviewImgClick(id){
    axios.get(`/api/reviewImg/${id}`)
    .then((results) => {
      this.setState({
        showModal: true,
        reviewImg: results.data[0].img,
        imgCaption: results.data[0].caption,
      })
    })
    .catch((err) => console.error(`Unsuccessful reviewImg info request: ${err}`))

  }

  closeModal(){
    this.setState({
      showModal: false
    })
  }

  showMore(){
    if (this.state.itemsToShow === this.state.reviews.length){
      loadMore.style.display="none"
    } else {
      this.setState({
        itemsToShow: this.state.itemsToShow + 8
      })
    } 
  }

  render(){
    return(
      <div>
      <div id="reviewNums">
        <span id="reviews">1 – {this.state.itemsToShow} of {this.state.reviews.length} Reviews</span>
        <span id="sort">
          <img id="q" src="https://img.icons8.com/material-sharp/24/000000/help.png"></img><span>Sort by:</span>
          <div className="dropdown">
            <button className="dropbtn"><span id="currentSort">Most Relevant{`  `}</span>
              <i className="fa fa-caret-down"></i>
            </button>
            <div className="dropdown-content">
              <a onClick={this.sortByRelevance} id="relevant">Most Relevant</a>
              <a onClick={this.sortByMostHelpful} id="helpful">Most Helpful</a>
              <a onClick={this.sortByHighestToLowest} id="highest">Highest To Lowest Rating</a>
              <a onClick={this.sortByLowestToHighest} id="lowest">Lowest To Highest Rating</a>
              <a onClick={this.sortByClick} id="recent">Most Recent</a>
            </div>
          </div>
        </span>
        </div> 
        <div>
          {this.state.rendered &&
          <ReviewsList itemsToShow={this.state.itemsToShow} closeModal={this.closeModal} reviewImgClick={this.reviewImgClick} reviewStars={this.reviewStars} reviews={this.state.reviews}/>
          }<button onClick={() => this.showMore()} id="loadMore">Load more</button>
          <Modal isOpen={this.state.showModal} onRequestClose={this.closeModal} style={modalStyle}>
          <div>
          <i onClick={this.closeModal} style={{float:"right", cursor:"pointer"}} className="fa fa-times-circle fa-lg" aria-hidden="true"></i> 
          <div id="modalPicContainer">
            <img id="clickedRevImg" src={this.state.reviewImg} alt="clicked_Img"/>
          </div>
          <p style={{color: "white", textAlign: "center"}}>{this.state.imgCaption}</p>
          </div>
          </Modal>
        </div>
      </div>
    )
  }
}

export default Reviews;