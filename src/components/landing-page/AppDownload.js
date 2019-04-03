import React, { Component } from 'react';
import { AppDownloadStyle } from './AppDownloadStyle'
import appStore from '../../assets/appstore.png'
import googlePlay from '../../assets/playstore.png'

class AppDownload extends Component {
  render() {
    return (
      <>
        <AppDownloadStyle>
          <section className="app-download-flex =">
            <div className="container">
              <div className="app-download-item">
                <p>#Lad Download </p>
                <h3>The Best Lad Network</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt.</p>
                <img src={appStore} alt="app store" className="app-store-img" />
                <img src={googlePlay} alt="google play" className="app-store-img" />
              </div>

              <div className="hero-moc"></div>
            </div>
          </section>

          <section className="promo-section">
            <div className="promo-row container">


              <div className="promo-col">
                <i className="fas fa-shield-alt promo-icon"></i>
                <h2>Highly Secured</h2>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam recusandae perferendis ipsum perspiciatis.</p>
              </div>

              <div className="promo-col">
                <i className="fas fa-layer-group promo-icon"></i> <h2>Highly Secured</h2>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam recusandae perferendis ipsum perspiciatis</p>
              </div>

              <div className="promo-col">
                <i className="fas fa-chart-bar promo-icon"></i>   <h2>Highly Secured</h2>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam recusandae perferendis ipsum perspiciatis</p>
              </div>

            </div>
          </section>
        </AppDownloadStyle>

      </>
    );
  }
}

export default AppDownload;