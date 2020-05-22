import axios from "axios";

/*
    `https://artpop-dev-b9e42.firebaseio.com/images/title or filename without ext

    thumb.json

    thumbnail = {
      filename: "1stStillLife.jpg",
      sizes: {
        55: "artpop-dev-b9e42.appspot.com/thumbs/1stStillLife_55x150.jpg"   //should provide the urlSigned string to the image stored in the bucket
        150: ,
        230: ,
        460: ,
        1400: 
      }
    }
*/

const instance = axios.create({
  baseURL: `https://artpop-dev-b9e42.firebaseio.com/`,
});

export default instance;
