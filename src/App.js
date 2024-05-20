import {Component} from 'react'
import Loader from 'react-loader-spinner'
import ProjectShowCase from './components/ProjectShowCase'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import './App.css'

//This is the list (static data) used in the application. You can move it to any component if needed.

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

// Replace your code here
const apiStatus = {
  initial: 'initial',
  loading: 'loading',
  success: 'success',
  fail: 'fail',
}

class App extends Component {
  state = {data: [], api: apiStatus.initial, sel: 'ALL'}
  componentDidMount() {
    this.getData()
  }
  getData = async () => {
    this.setState({api: apiStatus.loading})
    const {sel} = this.state

    const url = `https://apis.ccbp.in/ps/projects?category=${sel}`
    const options = {
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok == true) {
      const data = await response.json()
      const updateData = data.projectS.map(i => ({
        id: i.id,
        name: i.name,
        imageUrl: i.image_url,
      }))
      this.setState({data: updateData, api: apiStatus.success})
    } else {
      this.setState({api: apiStatus.fail})
    }
  }
  one = event => {
    this.setState({sel: event.target.value}, this.getData)
  }
  loadingView = () => (
    <div testid="loader" className="load">
      <Loader type="ThreeDots" color="#328af2" height={50} width={50} />
    </div>
  )
  successView = () => {
    const {data} = this.state
    return (
      <div className="pro-con">
        <ul className="app-con">
          {data.map(j => (
            <ProjectShowCase details={j} key={j.id} />
          ))}
        </ul>
      </div>
    )
  }
  failureView = () => (
    <div className="fail-con">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="image"
      />
      <h1 className="heading">Oops! Something Went Wrong</h1>
      <p className="para">
        We cannot seem to find the page you are looking for
      </p>
      <button className="button" type="button" onClick={this.getData}>
        Retry
      </button>
    </div>
  )
  finalRender = () => {
    const {api} = this.state
    switch (api) {
      case apiStatus.loading:
        return this.loadingView()
      case apiStatus.success:
        return this.successView()
      case apiStatus.fail:
        return this.failureView()
      default:
        return null
    }
  }
  render() {
    const {sel} = this.state
    return (
      <div>
        <nav className="nav-el">
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
            className="web"
          />
        </nav>
        <div className="main-con">
          <ul className="sel-con">
            <select className="sel" value={sel} onChange={this.one}>
              {categoriesList.map(each => (
                <option value={each.id} key={each.id}>
                  {each.displayText}
                </option>
              ))}
            </select>
          </ul>
          {this.finalRender()}
        </div>
      </div>
    )
  }
}
export default App
