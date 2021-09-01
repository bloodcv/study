import { printF } from './utils'
import './index.css'
import img from "./imgs/1.jpg"
printF('Hello Node1')

const JsIntoImg = document.querySelector('#JsIntoImg');
// JsIntoImg.src = './imgs/1.jpg'
// JsIntoImg.src = require('./imgs/1.jpg')
JsIntoImg.src = img