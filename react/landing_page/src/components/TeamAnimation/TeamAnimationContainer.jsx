import React, { Component } from 'react';
import * as THREE from 'three-full';
import { MEMBERS, DESCRIPTION_FONT_SIZE, NAME_FONT_SIZE } from '../../constants/members';

const SCROLL_RIGHT = 'RIGHT';
const SCROLL_LEFT = 'LEFT';
const DEFAULT_SPEED = -10;
const MAX_SPEED = 35;
const PHOTO_RADIUS = 140;
const PHOTO_BG_RADIUS = 310;
const PHOTO_BG_Y_OFFSET = -65;
const TEXT_OFFSET_X = 60;
const DESCRIPTION_Y_OFFSET = -50;
const NAME_Y_OFFSET = 5;
const MIN_X = -MEMBERS[MEMBERS.length - 1].x - 400;
let MAX_X = 0;

class TeamAnimationContainer extends Component {
  constructor(props) {
    super(props);
    this.speed = {
      x: DEFAULT_SPEED,
    };
    this.sceneDirection = 'RIGHT';
  }

  componentDidMount() {
    this.width = this.mount.clientWidth;
    this.height = this.mount.clientHeight - 50;

    this.setPositionMembers();

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      this.width / this.height,
      0.1,
      1000,
    );

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    const textureLoader = new THREE.TextureLoader();
    const fontLoader = new THREE.FontLoader();
    camera.position.z = 900;
    renderer.setClearColor('#F1F1F1');
    renderer.setSize(this.width, this.height);

    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.textureLoader = textureLoader;
    this.fontLoader = fontLoader;

    const photoTexture = MEMBERS.map(member =>
      this.getPhotoTexture(member));
    this.allTexture = [...photoTexture];

    // Descriprion texture add into scene in callback func
    MEMBERS.forEach(member =>
      this.getDescriptionTexture(member));

    this.allTexture.forEach(meshItem => {
      meshItem.mesh.position.set(meshItem.x, meshItem.y, 0);
      if (meshItem.bgMesh) {
        meshItem.bgMesh.position.set(meshItem.x, meshItem.y + PHOTO_BG_Y_OFFSET, -1);
        scene.add(meshItem.bgMesh);
      }

      scene.add(meshItem.mesh);
    });
    this.mount.appendChild(this.renderer.domElement);
    this.start();

    window.addEventListener('resize', this.onWindowResize, false);
    document.addEventListener('touchstart', this.handleTouchStart, false);
    document.addEventListener('touchend', this.handleTouchEnd, false);
    document.addEventListener('touchmove', this.handleTouchMove, false);
  }

  shouldComponentUpdate(nextProps) {
    return this.props.start !== nextProps.start;
  }

  componentWillUnmount() {
    this.stop();
    this.mount.removeChild(this.renderer.domElement);
  }

  onWindowResize = () => {
    if (this.mount.clientWidth && this.mount.clientHeight) {
      this.setPositionMembers();
      this.width = this.mount.clientWidth;
      this.height = this.mount.clientHeight - 50;
      this.renderer.setSize(this.width, this.height);
      this.camera.aspect = this.width / this.height;
      this.camera.updateProjectionMatrix();
    }
  }

  setPositionMembers = () => {
    let posLeft;

    if (window.innerWidth > 1000 && window.innerWidth < 1600) {
      posLeft = -800 + (window.innerWidth ** (1000 / window.innerWidth));
    } else if (window.innerWidth >= 1600) {
      posLeft = -800;
    } else {
      posLeft = 0;
    }

    MAX_X = posLeft;
    MEMBERS.filter(member => member.isFirstElement)
      .map(member => member.x = posLeft);
  }

  getDescriptionTexture = payload => {
    const {
      description, name, x, y,
    } = payload;
    this.createLable({
      label: name, x, y: y + NAME_Y_OFFSET, sizeFont: NAME_FONT_SIZE,
    });
    this.createLable({
      label: description, x, y: y + DESCRIPTION_Y_OFFSET, sizeFont: DESCRIPTION_FONT_SIZE,
    });
  }

  getPhotoTexture = payload => {
    const {
      photo, x, y, isFirstElement, bgImage,
    } = payload;
    const texture = this.textureLoader.load(photo);
    const geometryCore = new THREE.CircleGeometry(PHOTO_RADIUS, 1000);
    const materialCore = new THREE.MeshBasicMaterial({
      map: texture,
    });
    const mesh = new THREE.Mesh(geometryCore, materialCore);
    let bgMesh = null;

    if (bgImage) {
      const materialCoreBgImage = new THREE.MeshBasicMaterial({
        map: this.textureLoader.load(bgImage),
      });
      bgMesh = new THREE.Mesh(new THREE.CircleGeometry(PHOTO_BG_RADIUS, 1000), materialCoreBgImage);
    }

    return {
      mesh,
      bgMesh,
      x,
      y,
      isFirstElement,
    };
  }

  start = () => {
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(this.animate);
    }
  }

  stop = () => {
    cancelAnimationFrame(this.frameId);
  }

  animate = () => {
    let stopMove = false;
    this.allTexture.forEach(meshItem => {
      const { mesh, bgMesh, isFirstElement } = meshItem;

      // INFINITY SECTION SCROLL
      if (mesh.position.x < -3500) {
        mesh.position.x = (MIN_X * -1) - 2000;
        if (bgMesh) {
          bgMesh.position.x = mesh.position.x;
        }
      } else if (mesh.position.x > ((MIN_X * -1) + 500) && this.sceneDirection === SCROLL_LEFT) {
        mesh.position.x = -2200;
        if (bgMesh) {
          bgMesh.position.x = mesh.position.x;
        }
      }

      if (isFirstElement && mesh.position.x < MIN_X && this.speed.x < 0) {
        stopMove = true;
      }

      // START ANIMATION BY PROPS
      if (!this.props.start) {
        stopMove = true;
      }

      // MOVE SECTION
      mesh.position.x += stopMove ? 0 : this.speed.x * 0.2;
      if (bgMesh) {
        bgMesh.position.x += stopMove ? 0 : this.speed.x * 0.2;
      }
    });
    this.renderScene();
    this.frameId = window.requestAnimationFrame(this.animate);
  }

  createLable = (payload) => {
    const {
      label, x, y, sizeFont,
    } = payload;
    this.fontLoader.load('../../../static/fonts/helvetiker_regular.typeface.json', font => {
      const textShape = new THREE.BufferGeometry();
      const matLite = new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        opacity: 1,
        side: THREE.DoubleSide,
      });
      const geometry = new THREE.ShapeGeometry(font.generateShapes(label, sizeFont));
      geometry.computeBoundingBox();
      const xMid = -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);
      geometry.translate(xMid, 0, 0);
      textShape.fromGeometry(geometry);
      const mesh = new THREE.Mesh(textShape, matLite);
      const size = geometry.boundingBox.getSize();
      mesh.position.set(x + PHOTO_RADIUS + TEXT_OFFSET_X + (size.x / 2), y, 0);
      this.allTexture.push({
        mesh,
      });
      this.scene.add(mesh);
    });
  }

  handleMouseMove = event => {
    this.mousePos = {
      x: event.clientX,
      y: event.clientY,
    };
    this.updateSpeed();
  }

  handleOnMouseEnter = () => {
    document.addEventListener('mousemove', this.handleMouseMove, false);
  }

  handleOnMouseLeave = () => {
    document.removeEventListener('mousemove', this.handleMouseMove, false);
    if (this.speed) {
      this.speed.x = DEFAULT_SPEED;
    }
  }

  handleTouchStart = (event) => {
    event.preventDefault();
    this.mousePos = {
      x: event.touches[0].pageX,
      y: event.touches[0].pageY,
    };
    this.updateSpeed();
  }

  handleTouchEnd = () => {
    this.speed.x = DEFAULT_SPEED;
  }

  handleTouchMove = (event) => {
    event.preventDefault();
    this.mousePos = {
      x: event.touches[0].pageX,
      y: event.touches[0].pageY,
    };
    this.updateSpeed();
  }

  updateSpeed = () => {
    let newSpeed = 0;
    if (this.mousePos.x > this.width / 2) {
      this.sceneDirection = SCROLL_RIGHT;
      newSpeed = -MAX_SPEED * ((this.mousePos.x - (this.width / 2)) / (this.width / 2));
    } else {
      this.sceneDirection = SCROLL_LEFT;
      newSpeed = MAX_SPEED * (1 - (this.mousePos.x / (this.width / 2)));
    }
    this.speed.x = newSpeed > MAX_SPEED ? MAX_SPEED : newSpeed;
  }

  renderScene = () => {
    this.renderer.render(this.scene, this.camera);
  }

  render() {
    return (
      <div
        onMouseEnter={this.handleOnMouseEnter}
        onMouseLeave={this.handleOnMouseLeave}
        style={{ width: '100%', height: '100%' }}
        ref={(mount) => { this.mount = mount; }}
      />
    );
  }
}

export default TeamAnimationContainer;
