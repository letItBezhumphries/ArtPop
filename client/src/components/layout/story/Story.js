import React from "react";
import portrait from "../../../assets/images/soloTodd.jpg";
import background from "../../../assets/patterns/morocco/morocco.png";

const Story = (props) => {
  return (
    <section className="artist-view">
      <h1 className="heading-1 u-margin-top-">About the Artist</h1>

      <p className="artist-view__bio">
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quidem, magnam
        consequatur reiciendis sunt sapiente dolorum suscipit, corrupti ipsum
        obcaecati unde neque rem ducimus quaerat eveniet esse aspernatur.
        Laudantium, cumque ea! Lorem ipsum dolor sit, amet consectetur
        adipisicing elit. Quidem, magnam consequatur reiciendis sunt sapiente
        dolorum suscipit, corrupti ipsum obcaecati unde neque rem ducimus
        quaerat eveniet esse aspernatur. Laudantium, cumque ea! Lorem ipsum
        dolor sit, amet consectetur adipisicing elit. Quidem, magnam consequatur
        reiciendis sunt sapiente dolorum suscipit, corrupti ipsum obcaecati unde
        neque rem ducimus quaerat eveniet esse aspernatur. Laudantium, cumque
        ea! Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quidem,
        magnam consequatur reiciendis sunt sapiente dolorum suscipit, corrupti
        ipsum obcaecati unde neque rem ducimus quaerat eveniet esse aspernatur.
        Laudantium, cumque ea! Lorem ipsum dolor sit, amet consectetur
        adipisicing elit. Quidem, magnam consequatur reiciendis sunt sapiente
        dolorum suscipit, corrupti ipsum obcaecati unde neque rem ducimus
        quaerat eveniet esse aspernatur. Laudantium, cumque ea!
      </p>

      <div className="artist-view__photo-box">
        <img className="artist-view__img" src={portrait} alt="photo 1" />
      </div>

      <div className="artist-view__contact-btn-box">
        <button className="btn-inline">contact artist &dArr;</button>
      </div>
    </section>
  );
};

export default Story;
