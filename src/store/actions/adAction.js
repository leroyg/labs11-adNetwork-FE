import axios from "axios";

const URL = "https://lad-network.herokuapp.com";

// ------------------------------------ Get Ad by ID ------------------------------------

export const GET_AD_START = "GET_AD_START";
export const GET_AD_SUCCESS = "GET_AD_SUCCESS";
export const GET_AD_FAILURE = "GET_AD_FAILURE";

export const getAd = adId => dispatch => {
  dispatch({ type: GET_AD_START });
  axios
    .get(`${URL}/api/ads/${adId}`)
    .then(res => {
      dispatch({ type: GET_AD_SUCCESS, payload: res.data });
    })
    .catch(err => {
      dispatch({ type: GET_AD_FAILURE, payload: err || err.response.data });
    });
};

// ------------------------------------ Create Ad ------------------------------------

export const CREATE_AD_START = "CREATE_AD_START";
export const CREATE_AD_SUCCESS = "CREATE_AD_SUCCESS";
export const CREATE_AD_FAILURE = "CREATE_AD_FAILURE";

export const createAd = (ad, props) => dispatch => {
  dispatch({ type: CREATE_AD_START });
  axios
    .post(`${URL}/api/ads`, ad)
    .then(res => {
      dispatch({ type: CREATE_AD_SUCCESS, payload: res.data });
    })
    .then(() => {
      props.history.push("/dashboard/offers");
    })
    .catch(err => {
      dispatch({ type: CREATE_AD_FAILURE, payload: err.response.data });
    });
};

// ------------------------------------ Get Offer Ads ------------------------------------

export const GET_OFFER_ADS_START = "GET_OFFER_ADS_START";
export const GET_OFFER_ADS_SUCCESS = "GET_OFFER_ADS_SUCCESS";
export const GET_OFFER_ADS_FAILURE = "GET_OFFER_ADS_FAILURE";

export const getOfferAds = offer_id => dispatch => {
  dispatch({ type: GET_OFFER_ADS_START });
  axios
    .get(`${URL}/api/ads/offers/${offer_id}`)
    .then(res => {
      dispatch({ type: GET_OFFER_ADS_SUCCESS, payload: res.data });
    })
    .catch(err => {
      dispatch({ type: GET_OFFER_ADS_FAILURE, payload: err.response.data });
    });
};

// ------------------------------------ Delete Ads ------------------------------------

export const DELETE_AD_START = "DELETE_AD_START";
export const DELETE_AD_SUCCESS = "DELETE_AD_SUCCESS";
export const DELETE_AD_FAILURE = "DELETE_AD_FAILURE";

export const deleteAd = id => dispatch => {
  dispatch({ type: DELETE_AD_START })
  axios
    .delete(`${URL}/api/ads/${id}`)
    .then(res => {
      dispatch({ type: DELETE_AD_SUCCESS, payload: res.data })
    })
    .catch(err => {
      dispatch({ type: DELETE_AD_FAILURE, payload: err.response.data })
    })
}

// ------------------------------------ Change Ad Status ------------------------------------

export const UPDATE_AD_STATUS_START = "UPDATE_AD_START";
export const UPDATE_AD_STATUS_SUCCESS = "UPDATE_AD_SUCCESS";
export const UPDATE_AD_STATUS_FAILURE = "UPDATE_AD_FAILURE";

export const changeAdStatus = (ad, offer_id) => dispatch => {
  dispatch({ type: UPDATE_AD_STATUS_START })
  axios
    .put(`${URL}/api/ads/${ad.id}`, {active: !ad.active})
    .then(res => {
      dispatch({ type: UPDATE_AD_STATUS_SUCCESS, payload: res.data })
    })
    .then(() => {
      dispatch(getOfferAds(offer_id))
    })
    .catch(err => {
      dispatch({ type: UPDATE_AD_STATUS_FAILURE, payload: err.response.data })
    })
}
