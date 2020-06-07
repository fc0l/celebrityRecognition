import React from 'react';
import Particles from 'react-particles-js'
import './App.css';
import FaceRecognition from './components/FaceRecognition/FaceRecognition'
import Navigation from './components/Navigation/Navigation';
import Signin from './components/SignIn/Signin';
import Register from './components/Register/Register';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Clarifai from 'clarifai';

const app = new Clarifai.App({
 apiKey: 'cdf5f1dbb6b14a9f884147c4a8bc27f0'
});

const particlesOptions = 
{
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        value_area: 800
      }
    }}
}

class App extends React.Component {
  constructor(){
    super();
    this.state =
    {
      imageUrl: '',
      input: '',
      box: {},
      nameCel: '',
      route: 'signin'
    }
  }

  calculateFaceLocation = (data) =>
  {
    const clarifaiFace = data.outputs[0].data.regions[0];
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.region_info.bounding_box.left_col * width,
      topRow: clarifaiFace.region_info.bounding_box.top_row * height,
      rightCol: width - (clarifaiFace.region_info.bounding_box.right_col * width),
      bottomRow: height - (clarifaiFace.region_info.bounding_box.bottom_row * height),
      name: (clarifaiFace.data.concepts[0].name).toUpperCase()
    }
  }

  displayFaceBox = (box) => 
  {
    console.log(box);
    this.setState({box: box});
    this.setState({nameCel: box.name})
  }

onInputChange = (event) =>
{
  this.setState({ input: event.target.value });
}

onButtonSubmit = () =>
{
  this.setState({imageUrl: this.state.input})
  app.models.predict(
    Clarifai.CELEBRITY_MODEL, 
    this.state.input)
  .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
  .catch(err => console.log(err));
}

onRouteChange = (route) =>
{
  this.setState({route: route})
}

  render() {
  return (
    <div className="App">
        <Particles className='particles' 
          params={particlesOptions}/>
      
      { this.state.route === 'home' 
      ? <div>
          <Navigation onRouteChange={this.onRouteChange}/>
          <Logo />
          <Rank />
          <ImageLinkForm 
          onInputChange={this.onInputChange} 
          onButtonSubmit={this.onButtonSubmit}/>      
          <FaceRecognition nameCel={this.state.nameCel} box={this.state.box} imageUrl={this.state.imageUrl}/>
      </div>
      : (
          this.state.route === 'signin' 
          ? <Signin onRouteChange={this.onRouteChange}/>
          : <Register onRouteChange={this.onRouteChange}/>
        )
      
    }
    </div>
  );
}
}

export default App;
