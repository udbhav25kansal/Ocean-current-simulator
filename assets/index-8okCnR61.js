import{C as Gt,V as at,M as bt,T as yt,Q as It,S as jt,a as ot,R as Zt,P as Xt,b as Qt,G as Lt,c as Jt,d as kt,D as te,e as _t,f as ee,g as zt,E as Vt,h as Wt,i as ie,j as se,k as ne,B as oe,l as Mt,m as ae,A as re,n as le,o as Ht,p as he,q as qt,r as de,F as ce,s as ue,W as pe,t as me,u as fe,v as ge}from"./three-DzPpCVdy.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const r of o.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&i(r)}).observe(document,{childList:!0,subtree:!0});function e(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(s){if(s.ep)return;s.ep=!0;const o=e(s);fetch(s.href,o)}})();const Nt={type:"change"},Rt={type:"start"},Kt={type:"end"},Ct=new Zt,Bt=new Xt,ye=Math.cos(70*Qt.DEG2RAD),q=new at,tt=2*Math.PI,P={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},Tt=1e-6;class _e extends Gt{constructor(t,e=null){super(t,e),this.state=P.NONE,this.target=new at,this.cursor=new at,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:bt.ROTATE,MIDDLE:bt.DOLLY,RIGHT:bt.PAN},this.touches={ONE:yt.ROTATE,TWO:yt.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new at,this._lastQuaternion=new It,this._lastTargetPosition=new at,this._quat=new It().setFromUnitVectors(t.up,new at(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new jt,this._sphericalDelta=new jt,this._scale=1,this._panOffset=new at,this._rotateStart=new ot,this._rotateEnd=new ot,this._rotateDelta=new ot,this._panStart=new ot,this._panEnd=new ot,this._panDelta=new ot,this._dollyStart=new ot,this._dollyEnd=new ot,this._dollyDelta=new ot,this._dollyDirection=new at,this._mouse=new ot,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=ve.bind(this),this._onPointerDown=be.bind(this),this._onPointerUp=xe.bind(this),this._onContextMenu=Me.bind(this),this._onMouseWheel=Ce.bind(this),this._onKeyDown=Se.bind(this),this._onTouchStart=De.bind(this),this._onTouchMove=ke.bind(this),this._onMouseDown=we.bind(this),this._onMouseMove=Ee.bind(this),this._interceptControlDown=Te.bind(this),this._interceptControlUp=Ae.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}connect(t){super.connect(t),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(t){t.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=t}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(Nt),this.update(),this.state=P.NONE}update(t=null){const e=this.object.position;q.copy(e).sub(this.target),q.applyQuaternion(this._quat),this._spherical.setFromVector3(q),this.autoRotate&&this.state===P.NONE&&this._rotateLeft(this._getAutoRotationAngle(t)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let i=this.minAzimuthAngle,s=this.maxAzimuthAngle;isFinite(i)&&isFinite(s)&&(i<-Math.PI?i+=tt:i>Math.PI&&(i-=tt),s<-Math.PI?s+=tt:s>Math.PI&&(s-=tt),i<=s?this._spherical.theta=Math.max(i,Math.min(s,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(i+s)/2?Math.max(i,this._spherical.theta):Math.min(s,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let o=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const r=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),o=r!=this._spherical.radius}if(q.setFromSpherical(this._spherical),q.applyQuaternion(this._quatInverse),e.copy(this.target).add(q),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let r=null;if(this.object.isPerspectiveCamera){const c=q.length();r=this._clampDistance(c*this._scale);const u=c-r;this.object.position.addScaledVector(this._dollyDirection,u),this.object.updateMatrixWorld(),o=!!u}else if(this.object.isOrthographicCamera){const c=new at(this._mouse.x,this._mouse.y,0);c.unproject(this.object);const u=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),o=u!==this.object.zoom;const h=new at(this._mouse.x,this._mouse.y,0);h.unproject(this.object),this.object.position.sub(h).add(c),this.object.updateMatrixWorld(),r=q.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;r!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(r).add(this.object.position):(Ct.origin.copy(this.object.position),Ct.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(Ct.direction))<ye?this.object.lookAt(this.target):(Bt.setFromNormalAndCoplanarPoint(this.object.up,this.target),Ct.intersectPlane(Bt,this.target))))}else if(this.object.isOrthographicCamera){const r=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),r!==this.object.zoom&&(this.object.updateProjectionMatrix(),o=!0)}return this._scale=1,this._performCursorZoom=!1,o||this._lastPosition.distanceToSquared(this.object.position)>Tt||8*(1-this._lastQuaternion.dot(this.object.quaternion))>Tt||this._lastTargetPosition.distanceToSquared(this.target)>Tt?(this.dispatchEvent(Nt),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(t){return t!==null?tt/60*this.autoRotateSpeed*t:tt/60/60*this.autoRotateSpeed}_getZoomScale(t){const e=Math.abs(t*.01);return Math.pow(.95,this.zoomSpeed*e)}_rotateLeft(t){this._sphericalDelta.theta-=t}_rotateUp(t){this._sphericalDelta.phi-=t}_panLeft(t,e){q.setFromMatrixColumn(e,0),q.multiplyScalar(-t),this._panOffset.add(q)}_panUp(t,e){this.screenSpacePanning===!0?q.setFromMatrixColumn(e,1):(q.setFromMatrixColumn(e,0),q.crossVectors(this.object.up,q)),q.multiplyScalar(t),this._panOffset.add(q)}_pan(t,e){const i=this.domElement;if(this.object.isPerspectiveCamera){const s=this.object.position;q.copy(s).sub(this.target);let o=q.length();o*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*t*o/i.clientHeight,this.object.matrix),this._panUp(2*e*o/i.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(t*(this.object.right-this.object.left)/this.object.zoom/i.clientWidth,this.object.matrix),this._panUp(e*(this.object.top-this.object.bottom)/this.object.zoom/i.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(t,e){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const i=this.domElement.getBoundingClientRect(),s=t-i.left,o=e-i.top,r=i.width,c=i.height;this._mouse.x=s/r*2-1,this._mouse.y=-(o/c)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(t){return Math.max(this.minDistance,Math.min(this.maxDistance,t))}_handleMouseDownRotate(t){this._rotateStart.set(t.clientX,t.clientY)}_handleMouseDownDolly(t){this._updateZoomParameters(t.clientX,t.clientX),this._dollyStart.set(t.clientX,t.clientY)}_handleMouseDownPan(t){this._panStart.set(t.clientX,t.clientY)}_handleMouseMoveRotate(t){this._rotateEnd.set(t.clientX,t.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const e=this.domElement;this._rotateLeft(tt*this._rotateDelta.x/e.clientHeight),this._rotateUp(tt*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(t){this._dollyEnd.set(t.clientX,t.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(t){this._panEnd.set(t.clientX,t.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(t){this._updateZoomParameters(t.clientX,t.clientY),t.deltaY<0?this._dollyIn(this._getZoomScale(t.deltaY)):t.deltaY>0&&this._dollyOut(this._getZoomScale(t.deltaY)),this.update()}_handleKeyDown(t){let e=!1;switch(t.code){case this.keys.UP:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateUp(tt*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),e=!0;break;case this.keys.BOTTOM:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateUp(-tt*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),e=!0;break;case this.keys.LEFT:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateLeft(tt*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),e=!0;break;case this.keys.RIGHT:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateLeft(-tt*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),e=!0;break}e&&(t.preventDefault(),this.update())}_handleTouchStartRotate(t){if(this._pointers.length===1)this._rotateStart.set(t.pageX,t.pageY);else{const e=this._getSecondPointerPosition(t),i=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._rotateStart.set(i,s)}}_handleTouchStartPan(t){if(this._pointers.length===1)this._panStart.set(t.pageX,t.pageY);else{const e=this._getSecondPointerPosition(t),i=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._panStart.set(i,s)}}_handleTouchStartDolly(t){const e=this._getSecondPointerPosition(t),i=t.pageX-e.x,s=t.pageY-e.y,o=Math.sqrt(i*i+s*s);this._dollyStart.set(0,o)}_handleTouchStartDollyPan(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enablePan&&this._handleTouchStartPan(t)}_handleTouchStartDollyRotate(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enableRotate&&this._handleTouchStartRotate(t)}_handleTouchMoveRotate(t){if(this._pointers.length==1)this._rotateEnd.set(t.pageX,t.pageY);else{const i=this._getSecondPointerPosition(t),s=.5*(t.pageX+i.x),o=.5*(t.pageY+i.y);this._rotateEnd.set(s,o)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const e=this.domElement;this._rotateLeft(tt*this._rotateDelta.x/e.clientHeight),this._rotateUp(tt*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(t){if(this._pointers.length===1)this._panEnd.set(t.pageX,t.pageY);else{const e=this._getSecondPointerPosition(t),i=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._panEnd.set(i,s)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(t){const e=this._getSecondPointerPosition(t),i=t.pageX-e.x,s=t.pageY-e.y,o=Math.sqrt(i*i+s*s);this._dollyEnd.set(0,o),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const r=(t.pageX+e.x)*.5,c=(t.pageY+e.y)*.5;this._updateZoomParameters(r,c)}_handleTouchMoveDollyPan(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enablePan&&this._handleTouchMovePan(t)}_handleTouchMoveDollyRotate(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enableRotate&&this._handleTouchMoveRotate(t)}_addPointer(t){this._pointers.push(t.pointerId)}_removePointer(t){delete this._pointerPositions[t.pointerId];for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId){this._pointers.splice(e,1);return}}_isTrackingPointer(t){for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId)return!0;return!1}_trackPointer(t){let e=this._pointerPositions[t.pointerId];e===void 0&&(e=new ot,this._pointerPositions[t.pointerId]=e),e.set(t.pageX,t.pageY)}_getSecondPointerPosition(t){const e=t.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[e]}_customWheelEvent(t){const e=t.deltaMode,i={clientX:t.clientX,clientY:t.clientY,deltaY:t.deltaY};switch(e){case 1:i.deltaY*=16;break;case 2:i.deltaY*=100;break}return t.ctrlKey&&!this._controlActive&&(i.deltaY*=10),i}}function be(l){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(l.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(l)&&(this._addPointer(l),l.pointerType==="touch"?this._onTouchStart(l):this._onMouseDown(l)))}function ve(l){this.enabled!==!1&&(l.pointerType==="touch"?this._onTouchMove(l):this._onMouseMove(l))}function xe(l){switch(this._removePointer(l),this._pointers.length){case 0:this.domElement.releasePointerCapture(l.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(Kt),this.state=P.NONE;break;case 1:const t=this._pointers[0],e=this._pointerPositions[t];this._onTouchStart({pointerId:t,pageX:e.x,pageY:e.y});break}}function we(l){let t;switch(l.button){case 0:t=this.mouseButtons.LEFT;break;case 1:t=this.mouseButtons.MIDDLE;break;case 2:t=this.mouseButtons.RIGHT;break;default:t=-1}switch(t){case bt.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(l),this.state=P.DOLLY;break;case bt.ROTATE:if(l.ctrlKey||l.metaKey||l.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(l),this.state=P.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(l),this.state=P.ROTATE}break;case bt.PAN:if(l.ctrlKey||l.metaKey||l.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(l),this.state=P.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(l),this.state=P.PAN}break;default:this.state=P.NONE}this.state!==P.NONE&&this.dispatchEvent(Rt)}function Ee(l){switch(this.state){case P.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(l);break;case P.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(l);break;case P.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(l);break}}function Ce(l){this.enabled===!1||this.enableZoom===!1||this.state!==P.NONE||(l.preventDefault(),this.dispatchEvent(Rt),this._handleMouseWheel(this._customWheelEvent(l)),this.dispatchEvent(Kt))}function Se(l){this.enabled!==!1&&this._handleKeyDown(l)}function De(l){switch(this._trackPointer(l),this._pointers.length){case 1:switch(this.touches.ONE){case yt.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(l),this.state=P.TOUCH_ROTATE;break;case yt.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(l),this.state=P.TOUCH_PAN;break;default:this.state=P.NONE}break;case 2:switch(this.touches.TWO){case yt.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(l),this.state=P.TOUCH_DOLLY_PAN;break;case yt.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(l),this.state=P.TOUCH_DOLLY_ROTATE;break;default:this.state=P.NONE}break;default:this.state=P.NONE}this.state!==P.NONE&&this.dispatchEvent(Rt)}function ke(l){switch(this._trackPointer(l),this.state){case P.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(l),this.update();break;case P.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(l),this.update();break;case P.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(l),this.update();break;case P.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(l),this.update();break;default:this.state=P.NONE}}function Me(l){this.enabled!==!1&&l.preventDefault()}function Te(l){l.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function Ae(l){l.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}class Le{constructor(){this.group=new Lt,this.createOcean(),this.createLandmasses()}createOcean(){const t=new Jt(100,120,100,120),e=new kt({color:1728378,transparent:!0,opacity:.9,metalness:.1,roughness:.6,side:te});this.ocean=new _t(t,e),this.ocean.rotation.x=-Math.PI/2,this.ocean.receiveShadow=!0,this.oceanGeometry=t,this.waveTime=0,this.group.add(this.ocean);const i=new ee(120,40,2781066,1724266);i.position.y=.1,this.group.add(i)}createLandmasses(){const t=new kt({color:2969622,roughness:.9,metalness:.1}),e=new zt;e.moveTo(-60,-50),e.lineTo(-60,50),e.lineTo(-50,55),e.lineTo(-48,50),e.lineTo(-48,-50),e.lineTo(-52,-55),e.closePath();const i=new Vt(e,{depth:2,bevelEnabled:!1}),s=new _t(i,t);s.rotation.x=-Math.PI/2,s.position.y=1,this.group.add(s);const o=new zt;o.moveTo(48,-60),o.lineTo(48,30),o.lineTo(45,40),o.lineTo(40,50),o.lineTo(35,55),o.lineTo(35,60),o.lineTo(60,60),o.lineTo(60,-60),o.closePath();const r=new Vt(o,{depth:2,bevelEnabled:!1}),c=new _t(r,t);c.rotation.x=-Math.PI/2,c.position.y=1,this.group.add(c);const u=new Wt(1.5,1.5,.5,16),h=new kt({color:5227511,emissive:2201331,emissiveIntensity:.3});this.riverMouth=new _t(u,h),this.riverMouth.position.set(35,.5,-45),this.group.add(this.riverMouth),this.addLabel("Vancouver Island",-50,2,0),this.addLabel("Mainland BC",50,2,0),this.addLabel("Fraser River",35,2,-48)}addLabel(t,e,i,s){const o=document.createElement("canvas"),r=o.getContext("2d");o.width=512,o.height=128,r.fillStyle="rgba(0, 0, 0, 0.6)",r.fillRect(0,0,o.width,o.height),r.font="Bold 48px Arial",r.fillStyle="#ffffff",r.textAlign="center",r.textBaseline="middle",r.fillText(t,o.width/2,o.height/2);const c=new ie(o),u=new se({map:c}),h=new ne(u);h.position.set(e,i,s),h.scale.set(15,4,1),this.group.add(h)}update(t){this.waveTime=t;const e=this.oceanGeometry.attributes.position;for(let s=0;s<e.count;s++){const o=e.getX(s),r=e.getY(s),c=Math.sin(o*.1+t*.5)*Math.cos(r*.1+t*.3)*.3;e.setZ(s,c)}e.needsUpdate=!0,this.oceanGeometry.computeVertexNormals();const i=Math.sin(t*2)*.2+1;this.riverMouth.scale.set(i,1,i)}}class Pe{constructor(t=5e3){this.particleCount=t,this.velocityField=null,this.dataGenerator=null,this.createParticles()}createParticles(){const t=new Float32Array(this.particleCount*3),e=new Float32Array(this.particleCount*3),i=new Float32Array(this.particleCount),s=new Float32Array(this.particleCount);for(let c=0;c<this.particleCount;c++){const u=c*3;t[u]=(Math.random()-.5)*90,t[u+1]=Math.random()*.5+.5,t[u+2]=(Math.random()-.5)*110,e[u]=.3,e[u+1]=.7,e[u+2]=1,i[c]=Math.random()*.5+.3,s[c]=Math.random()}const o=new oe;o.setAttribute("position",new Mt(t,3)),o.setAttribute("color",new Mt(e,3)),o.setAttribute("size",new Mt(i,1)),this.lifetimes=s;const r=new ae({size:.8,vertexColors:!0,transparent:!0,opacity:.7,blending:re,depthWrite:!1,sizeAttenuation:!0});this.points=new le(o,r),this.geometry=o}setVelocityField(t){this.velocityField=t}update(t){if(!this.velocityField)return;const e=this.geometry.attributes.position.array,i=this.geometry.attributes.color.array,s=this.getMaxVelocity(this.velocityField);for(let o=0;o<this.particleCount;o++){const r=o*3,c=e[r];e[r+1];const u=e[r+2],h=this.getVelocityAt(c,u,this.velocityField),f=5;e[r]+=h.u*t*f,e[r+2]+=h.v*t*f,this.lifetimes[o]+=t*.2,this.lifetimes[o]>1&&(e[r]=(Math.random()-.5)*90,e[r+1]=Math.random()*.5+.5,e[r+2]=(Math.random()-.5)*110,this.lifetimes[o]=0),(Math.abs(e[r])>50||Math.abs(e[r+2])>60)&&(e[r]=(Math.random()-.5)*90,e[r+2]=(Math.random()-.5)*110,this.lifetimes[o]=0);const y=Math.min(h.magnitude/(s+.01),1);if(y<.33){const C=y/.33;i[r]=.2+C*.3,i[r+1]=.5+C*.5,i[r+2]=1}else if(y<.66){const C=(y-.33)/.33;i[r]=.5+C*.5,i[r+1]=1,i[r+2]=1-C*1}else{const C=(y-.66)/.34;i[r]=1,i[r+1]=1-C*1,i[r+2]=0}const _=Math.sin(this.lifetimes[o]*Math.PI);i[r]*=_,i[r+1]*=_,i[r+2]*=_}this.geometry.attributes.position.needsUpdate=!0,this.geometry.attributes.color.needsUpdate=!0}setParticleCount(t){this.particleCount=t,this.points.geometry.dispose(),this.createParticles()}getVelocityAt(t,e,i){const s=i[0].length,o=i.length,r=2.5,c=t/r+s/2,u=e/r+o/2;if(c<0||c>=s-1||u<0||u>=o-1)return{u:0,v:0,magnitude:0};const h=Math.floor(u),f=Math.floor(c),y=c-f,_=u-h,C=i[h][f],I=i[h][f+1],j=i[h+1][f],G=i[h+1][f+1],S=(1-y)*(1-_)*C.u+y*(1-_)*I.u+(1-y)*_*j.u+y*_*G.u,x=(1-y)*(1-_)*C.v+y*(1-_)*I.v+(1-y)*_*j.v+y*_*G.v,B=Math.sqrt(S*S+x*x);return{u:S,v:x,magnitude:B}}getMaxVelocity(t){let e=0;for(let i=0;i<t.length;i++)for(let s=0;s<t[i].length;s++)t[i][s].magnitude>e&&(e=t[i][s].magnitude);return e}}class Re{constructor(){this.group=new Lt,this.arrows=[],this.samplePoints=this.createSampleGrid()}createSampleGrid(){const t=[];for(let i=-50;i<=50;i+=10)for(let s=-40;s<=40;s+=10)t.push({x:s,z:i});return t}update(t){this.group.clear(),this.arrows=[];let e=0;for(let i=0;i<t.length;i++)for(let s=0;s<t[i].length;s++)t[i][s].magnitude>e&&(e=t[i][s].magnitude);this.samplePoints.forEach(i=>{const s=this.interpolateVelocity(i.x,i.z,t);if(s.magnitude>.01){const o=this.createArrow(i.x,i.z,s.u,s.v,s.magnitude,e);this.group.add(o),this.arrows.push(o)}})}interpolateVelocity(t,e,i){let s=1/0,o={u:0,v:0,magnitude:0};for(let r=0;r<i.length;r++)for(let c=0;c<i[r].length;c++){const u=i[r][c].x-t,h=i[r][c].z-e,f=Math.sqrt(u*u+h*h);f<s&&(s=f,o=i[r][c])}return o}createArrow(t,e,i,s,o,r){const c=new Lt;new at(i,0,s).normalize();const u=o/(r+.01)*8,h=o/(r+.01),f=this.getColorFromSpeed(h),y=new Wt(.1,.1,u*.7,8),_=new Ht({color:f}),C=new _t(y,_),I=new he(.3,u*.3,8),j=new Ht({color:f}),G=new _t(I,j);C.position.y=u*.35,G.position.y=u*.7+u*.15,c.add(C),c.add(G);const S=Math.atan2(i,s);return c.rotation.y=-S,c.rotation.x=Math.PI/2,c.position.set(t,1,e),c}getColorFromSpeed(t){const e=new qt;if(t<.33){const i=t/.33;e.setRGB(.2+i*.3,.5+i*.5,1)}else if(t<.66){const i=(t-.33)/.33;e.setRGB(.5+i*.5,1,1-i)}else{const i=(t-.66)/.34;e.setRGB(1,1-i,0)}return e}setVisible(t){this.group.visible=t}}function Oe(l){return l&&l.__esModule&&Object.prototype.hasOwnProperty.call(l,"default")?l.default:l}var St={exports:{}};/* @license
Papa Parse
v5.5.3
https://github.com/mholt/PapaParse
License: MIT
*/var $e=St.exports,Ut;function Fe(){return Ut||(Ut=1,(function(l,t){((e,i)=>{l.exports=i()})($e,function e(){var i=typeof self<"u"?self:typeof window<"u"?window:i!==void 0?i:{},s,o=!i.document&&!!i.postMessage,r=i.IS_PAPA_WORKER||!1,c={},u=0,h={};function f(n){this._handle=null,this._finished=!1,this._completed=!1,this._halted=!1,this._input=null,this._baseIndex=0,this._partialLine="",this._rowCount=0,this._start=0,this._nextChunk=null,this.isFirstChunk=!0,this._completeResults={data:[],errors:[],meta:{}},(function(a){var d=vt(a);d.chunkSize=parseInt(d.chunkSize),a.step||a.chunk||(d.chunkSize=null),this._handle=new j(d),(this._handle.streamer=this)._config=d}).call(this,n),this.parseChunk=function(a,d){var m=parseInt(this._config.skipFirstNLines)||0;if(this.isFirstChunk&&0<m){let D=this._config.newline;D||(p=this._config.quoteChar||'"',D=this._handle.guessLineEndings(a,p)),a=[...a.split(D).slice(m)].join(D)}this.isFirstChunk&&O(this._config.beforeFirstChunk)&&(p=this._config.beforeFirstChunk(a))!==void 0&&(a=p),this.isFirstChunk=!1,this._halted=!1;var m=this._partialLine+a,p=(this._partialLine="",this._handle.parse(m,this._baseIndex,!this._finished));if(!this._handle.paused()&&!this._handle.aborted()){if(a=p.meta.cursor,m=(this._finished||(this._partialLine=m.substring(a-this._baseIndex),this._baseIndex=a),p&&p.data&&(this._rowCount+=p.data.length),this._finished||this._config.preview&&this._rowCount>=this._config.preview),r)i.postMessage({results:p,workerId:h.WORKER_ID,finished:m});else if(O(this._config.chunk)&&!d){if(this._config.chunk(p,this._handle),this._handle.paused()||this._handle.aborted())return void(this._halted=!0);this._completeResults=p=void 0}return this._config.step||this._config.chunk||(this._completeResults.data=this._completeResults.data.concat(p.data),this._completeResults.errors=this._completeResults.errors.concat(p.errors),this._completeResults.meta=p.meta),this._completed||!m||!O(this._config.complete)||p&&p.meta.aborted||(this._config.complete(this._completeResults,this._input),this._completed=!0),m||p&&p.meta.paused||this._nextChunk(),p}this._halted=!0},this._sendError=function(a){O(this._config.error)?this._config.error(a):r&&this._config.error&&i.postMessage({workerId:h.WORKER_ID,error:a,finished:!1})}}function y(n){var a;(n=n||{}).chunkSize||(n.chunkSize=h.RemoteChunkSize),f.call(this,n),this._nextChunk=o?function(){this._readChunk(),this._chunkLoaded()}:function(){this._readChunk()},this.stream=function(d){this._input=d,this._nextChunk()},this._readChunk=function(){if(this._finished)this._chunkLoaded();else{if(a=new XMLHttpRequest,this._config.withCredentials&&(a.withCredentials=this._config.withCredentials),o||(a.onload=ut(this._chunkLoaded,this),a.onerror=ut(this._chunkError,this)),a.open(this._config.downloadRequestBody?"POST":"GET",this._input,!o),this._config.downloadRequestHeaders){var d,m=this._config.downloadRequestHeaders;for(d in m)a.setRequestHeader(d,m[d])}var p;this._config.chunkSize&&(p=this._start+this._config.chunkSize-1,a.setRequestHeader("Range","bytes="+this._start+"-"+p));try{a.send(this._config.downloadRequestBody)}catch(D){this._chunkError(D.message)}o&&a.status===0&&this._chunkError()}},this._chunkLoaded=function(){a.readyState===4&&(a.status<200||400<=a.status?this._chunkError():(this._start+=this._config.chunkSize||a.responseText.length,this._finished=!this._config.chunkSize||this._start>=(d=>(d=d.getResponseHeader("Content-Range"))!==null?parseInt(d.substring(d.lastIndexOf("/")+1)):-1)(a),this.parseChunk(a.responseText)))},this._chunkError=function(d){d=a.statusText||d,this._sendError(new Error(d))}}function _(n){(n=n||{}).chunkSize||(n.chunkSize=h.LocalChunkSize),f.call(this,n);var a,d,m=typeof FileReader<"u";this.stream=function(p){this._input=p,d=p.slice||p.webkitSlice||p.mozSlice,m?((a=new FileReader).onload=ut(this._chunkLoaded,this),a.onerror=ut(this._chunkError,this)):a=new FileReaderSync,this._nextChunk()},this._nextChunk=function(){this._finished||this._config.preview&&!(this._rowCount<this._config.preview)||this._readChunk()},this._readChunk=function(){var p=this._input,D=(this._config.chunkSize&&(D=Math.min(this._start+this._config.chunkSize,this._input.size),p=d.call(p,this._start,D)),a.readAsText(p,this._config.encoding));m||this._chunkLoaded({target:{result:D}})},this._chunkLoaded=function(p){this._start+=this._config.chunkSize,this._finished=!this._config.chunkSize||this._start>=this._input.size,this.parseChunk(p.target.result)},this._chunkError=function(){this._sendError(a.error)}}function C(n){var a;f.call(this,n=n||{}),this.stream=function(d){return a=d,this._nextChunk()},this._nextChunk=function(){var d,m;if(!this._finished)return d=this._config.chunkSize,a=d?(m=a.substring(0,d),a.substring(d)):(m=a,""),this._finished=!a,this.parseChunk(m)}}function I(n){f.call(this,n=n||{});var a=[],d=!0,m=!1;this.pause=function(){f.prototype.pause.apply(this,arguments),this._input.pause()},this.resume=function(){f.prototype.resume.apply(this,arguments),this._input.resume()},this.stream=function(p){this._input=p,this._input.on("data",this._streamData),this._input.on("end",this._streamEnd),this._input.on("error",this._streamError)},this._checkIsFinished=function(){m&&a.length===1&&(this._finished=!0)},this._nextChunk=function(){this._checkIsFinished(),a.length?this.parseChunk(a.shift()):d=!0},this._streamData=ut(function(p){try{a.push(typeof p=="string"?p:p.toString(this._config.encoding)),d&&(d=!1,this._checkIsFinished(),this.parseChunk(a.shift()))}catch(D){this._streamError(D)}},this),this._streamError=ut(function(p){this._streamCleanUp(),this._sendError(p)},this),this._streamEnd=ut(function(){this._streamCleanUp(),m=!0,this._streamData("")},this),this._streamCleanUp=ut(function(){this._input.removeListener("data",this._streamData),this._input.removeListener("end",this._streamEnd),this._input.removeListener("error",this._streamError)},this)}function j(n){var a,d,m,p,D=Math.pow(2,53),U=-D,et=/^\s*-?(\d+\.?|\.\d+|\d+\.\d+)([eE][-+]?\d+)?\s*$/,it=/^((\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z)))$/,k=this,z=0,b=0,X=!1,w=!1,M=[],g={data:[],errors:[],meta:{}};function Y(T){return n.skipEmptyLines==="greedy"?T.join("").trim()==="":T.length===1&&T[0].length===0}function N(){if(g&&m&&(st("Delimiter","UndetectableDelimiter","Unable to auto-detect delimiting character; defaulted to '"+h.DefaultDelimiter+"'"),m=!1),n.skipEmptyLines&&(g.data=g.data.filter(function(v){return!Y(v)})),Z()){let v=function(H,W){O(n.transformHeader)&&(H=n.transformHeader(H,W)),M.push(H)};if(g)if(Array.isArray(g.data[0])){for(var T=0;Z()&&T<g.data.length;T++)g.data[T].forEach(v);g.data.splice(0,1)}else g.data.forEach(v)}function L(v,H){for(var W=n.header?{}:[],R=0;R<v.length;R++){var $=R,A=v[R],A=((nt,E)=>(F=>(n.dynamicTypingFunction&&n.dynamicTyping[F]===void 0&&(n.dynamicTyping[F]=n.dynamicTypingFunction(F)),(n.dynamicTyping[F]||n.dynamicTyping)===!0))(nt)?E==="true"||E==="TRUE"||E!=="false"&&E!=="FALSE"&&((F=>{if(et.test(F)&&(F=parseFloat(F),U<F&&F<D))return 1})(E)?parseFloat(E):it.test(E)?new Date(E):E===""?null:E):E)($=n.header?R>=M.length?"__parsed_extra":M[R]:$,A=n.transform?n.transform(A,$):A);$==="__parsed_extra"?(W[$]=W[$]||[],W[$].push(A)):W[$]=A}return n.header&&(R>M.length?st("FieldMismatch","TooManyFields","Too many fields: expected "+M.length+" fields but parsed "+R,b+H):R<M.length&&st("FieldMismatch","TooFewFields","Too few fields: expected "+M.length+" fields but parsed "+R,b+H)),W}var V;g&&(n.header||n.dynamicTyping||n.transform)&&(V=1,!g.data.length||Array.isArray(g.data[0])?(g.data=g.data.map(L),V=g.data.length):g.data=L(g.data,0),n.header&&g.meta&&(g.meta.fields=M),b+=V)}function Z(){return n.header&&M.length===0}function st(T,L,V,v){T={type:T,code:L,message:V},v!==void 0&&(T.row=v),g.errors.push(T)}O(n.step)&&(p=n.step,n.step=function(T){g=T,Z()?N():(N(),g.data.length!==0&&(z+=T.data.length,n.preview&&z>n.preview?d.abort():(g.data=g.data[0],p(g,k))))}),this.parse=function(T,L,V){var v=n.quoteChar||'"',v=(n.newline||(n.newline=this.guessLineEndings(T,v)),m=!1,n.delimiter?O(n.delimiter)&&(n.delimiter=n.delimiter(T),g.meta.delimiter=n.delimiter):((v=((H,W,R,$,A)=>{var nt,E,F,pt;A=A||[",","	","|",";",h.RECORD_SEP,h.UNIT_SEP];for(var ft=0;ft<A.length;ft++){for(var rt,xt=A[ft],Q=0,lt=0,K=0,J=(F=void 0,new S({comments:$,delimiter:xt,newline:W,preview:10}).parse(H)),ct=0;ct<J.data.length;ct++)R&&Y(J.data[ct])?K++:(rt=J.data[ct].length,lt+=rt,F===void 0?F=rt:0<rt&&(Q+=Math.abs(rt-F),F=rt));0<J.data.length&&(lt/=J.data.length-K),(E===void 0||Q<=E)&&(pt===void 0||pt<lt)&&1.99<lt&&(E=Q,nt=xt,pt=lt)}return{successful:!!(n.delimiter=nt),bestDelimiter:nt}})(T,n.newline,n.skipEmptyLines,n.comments,n.delimitersToGuess)).successful?n.delimiter=v.bestDelimiter:(m=!0,n.delimiter=h.DefaultDelimiter),g.meta.delimiter=n.delimiter),vt(n));return n.preview&&n.header&&v.preview++,a=T,d=new S(v),g=d.parse(a,L,V),N(),X?{meta:{paused:!0}}:g||{meta:{paused:!1}}},this.paused=function(){return X},this.pause=function(){X=!0,d.abort(),a=O(n.chunk)?"":a.substring(d.getCharIndex())},this.resume=function(){k.streamer._halted?(X=!1,k.streamer.parseChunk(a,!0)):setTimeout(k.resume,3)},this.aborted=function(){return w},this.abort=function(){w=!0,d.abort(),g.meta.aborted=!0,O(n.complete)&&n.complete(g),a=""},this.guessLineEndings=function(H,v){H=H.substring(0,1048576);var v=new RegExp(G(v)+"([^]*?)"+G(v),"gm"),V=(H=H.replace(v,"")).split("\r"),v=H.split(`
`),H=1<v.length&&v[0].length<V[0].length;if(V.length===1||H)return`
`;for(var W=0,R=0;R<V.length;R++)V[R][0]===`
`&&W++;return W>=V.length/2?`\r
`:"\r"}}function G(n){return n.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function S(n){var a=(n=n||{}).delimiter,d=n.newline,m=n.comments,p=n.step,D=n.preview,U=n.fastMode,et=null,it=!1,k=n.quoteChar==null?'"':n.quoteChar,z=k;if(n.escapeChar!==void 0&&(z=n.escapeChar),(typeof a!="string"||-1<h.BAD_DELIMITERS.indexOf(a))&&(a=","),m===a)throw new Error("Comment character same as delimiter");m===!0?m="#":(typeof m!="string"||-1<h.BAD_DELIMITERS.indexOf(m))&&(m=!1),d!==`
`&&d!=="\r"&&d!==`\r
`&&(d=`
`);var b=0,X=!1;this.parse=function(w,M,g){if(typeof w!="string")throw new Error("Input must be a string");var Y=w.length,N=a.length,Z=d.length,st=m.length,T=O(p),L=[],V=[],v=[],H=b=0;if(!w)return Q();if(U||U!==!1&&w.indexOf(k)===-1){for(var W=w.split(d),R=0;R<W.length;R++){if(v=W[R],b+=v.length,R!==W.length-1)b+=d.length;else if(g)return Q();if(!m||v.substring(0,st)!==m){if(T){if(L=[],pt(v.split(a)),lt(),X)return Q()}else pt(v.split(a));if(D&&D<=R)return L=L.slice(0,D),Q(!0)}}return Q()}for(var $=w.indexOf(a,b),A=w.indexOf(d,b),nt=new RegExp(G(z)+G(k),"g"),E=w.indexOf(k,b);;)if(w[b]===k)for(E=b,b++;;){if((E=w.indexOf(k,E+1))===-1)return g||V.push({type:"Quotes",code:"MissingQuotes",message:"Quoted field unterminated",row:L.length,index:b}),rt();if(E===Y-1)return rt(w.substring(b,E).replace(nt,k));if(k===z&&w[E+1]===z)E++;else if(k===z||E===0||w[E-1]!==z){$!==-1&&$<E+1&&($=w.indexOf(a,E+1));var F=ft((A=A!==-1&&A<E+1?w.indexOf(d,E+1):A)===-1?$:Math.min($,A));if(w.substr(E+1+F,N)===a){v.push(w.substring(b,E).replace(nt,k)),w[b=E+1+F+N]!==k&&(E=w.indexOf(k,b)),$=w.indexOf(a,b),A=w.indexOf(d,b);break}if(F=ft(A),w.substring(E+1+F,E+1+F+Z)===d){if(v.push(w.substring(b,E).replace(nt,k)),xt(E+1+F+Z),$=w.indexOf(a,b),E=w.indexOf(k,b),T&&(lt(),X))return Q();if(D&&L.length>=D)return Q(!0);break}V.push({type:"Quotes",code:"InvalidQuotes",message:"Trailing quote on quoted field is malformed",row:L.length,index:b}),E++}}else if(m&&v.length===0&&w.substring(b,b+st)===m){if(A===-1)return Q();b=A+Z,A=w.indexOf(d,b),$=w.indexOf(a,b)}else if($!==-1&&($<A||A===-1))v.push(w.substring(b,$)),b=$+N,$=w.indexOf(a,b);else{if(A===-1)break;if(v.push(w.substring(b,A)),xt(A+Z),T&&(lt(),X))return Q();if(D&&L.length>=D)return Q(!0)}return rt();function pt(K){L.push(K),H=b}function ft(K){var J=0;return J=K!==-1&&(K=w.substring(E+1,K))&&K.trim()===""?K.length:J}function rt(K){return g||(K===void 0&&(K=w.substring(b)),v.push(K),b=Y,pt(v),T&&lt()),Q()}function xt(K){b=K,pt(v),v=[],A=w.indexOf(d,b)}function Q(K){if(n.header&&!M&&L.length&&!it){var J=L[0],ct=Object.create(null),Dt=new Set(J);let $t=!1;for(let gt=0;gt<J.length;gt++){let ht=J[gt];if(ct[ht=O(n.transformHeader)?n.transformHeader(ht,gt):ht]){let wt,Ft=ct[ht];for(;wt=ht+"_"+Ft,Ft++,Dt.has(wt););Dt.add(wt),J[gt]=wt,ct[ht]++,$t=!0,(et=et===null?{}:et)[wt]=ht}else ct[ht]=1,J[gt]=ht;Dt.add(ht)}$t&&console.warn("Duplicate headers found and renamed."),it=!0}return{data:L,errors:V,meta:{delimiter:a,linebreak:d,aborted:X,truncated:!!K,cursor:H+(M||0),renamedHeaders:et}}}function lt(){p(Q()),L=[],V=[]}},this.abort=function(){X=!0},this.getCharIndex=function(){return b}}function x(n){var a=n.data,d=c[a.workerId],m=!1;if(a.error)d.userError(a.error,a.file);else if(a.results&&a.results.data){var p={abort:function(){m=!0,B(a.workerId,{data:[],errors:[],meta:{aborted:!0}})},pause:mt,resume:mt};if(O(d.userStep)){for(var D=0;D<a.results.data.length&&(d.userStep({data:a.results.data[D],errors:a.results.errors,meta:a.results.meta},p),!m);D++);delete a.results}else O(d.userChunk)&&(d.userChunk(a.results,p,a.file),delete a.results)}a.finished&&!m&&B(a.workerId,a.results)}function B(n,a){var d=c[n];O(d.userComplete)&&d.userComplete(a),d.terminate(),delete c[n]}function mt(){throw new Error("Not implemented.")}function vt(n){if(typeof n!="object"||n===null)return n;var a,d=Array.isArray(n)?[]:{};for(a in n)d[a]=vt(n[a]);return d}function ut(n,a){return function(){n.apply(a,arguments)}}function O(n){return typeof n=="function"}return h.parse=function(n,a){var d=(a=a||{}).dynamicTyping||!1;if(O(d)&&(a.dynamicTypingFunction=d,d={}),a.dynamicTyping=d,a.transform=!!O(a.transform)&&a.transform,!a.worker||!h.WORKERS_SUPPORTED)return d=null,h.NODE_STREAM_INPUT,typeof n=="string"?(n=(m=>m.charCodeAt(0)!==65279?m:m.slice(1))(n),d=new(a.download?y:C)(a)):n.readable===!0&&O(n.read)&&O(n.on)?d=new I(a):(i.File&&n instanceof File||n instanceof Object)&&(d=new _(a)),d.stream(n);(d=(()=>{var m;return!!h.WORKERS_SUPPORTED&&(m=(()=>{var p=i.URL||i.webkitURL||null,D=e.toString();return h.BLOB_URL||(h.BLOB_URL=p.createObjectURL(new Blob(["var global = (function() { if (typeof self !== 'undefined') { return self; } if (typeof window !== 'undefined') { return window; } if (typeof global !== 'undefined') { return global; } return {}; })(); global.IS_PAPA_WORKER=true; ","(",D,")();"],{type:"text/javascript"})))})(),(m=new i.Worker(m)).onmessage=x,m.id=u++,c[m.id]=m)})()).userStep=a.step,d.userChunk=a.chunk,d.userComplete=a.complete,d.userError=a.error,a.step=O(a.step),a.chunk=O(a.chunk),a.complete=O(a.complete),a.error=O(a.error),delete a.worker,d.postMessage({input:n,config:a,workerId:d.id})},h.unparse=function(n,a){var d=!1,m=!0,p=",",D=`\r
`,U='"',et=U+U,it=!1,k=null,z=!1,b=((()=>{if(typeof a=="object"){if(typeof a.delimiter!="string"||h.BAD_DELIMITERS.filter(function(M){return a.delimiter.indexOf(M)!==-1}).length||(p=a.delimiter),typeof a.quotes!="boolean"&&typeof a.quotes!="function"&&!Array.isArray(a.quotes)||(d=a.quotes),typeof a.skipEmptyLines!="boolean"&&typeof a.skipEmptyLines!="string"||(it=a.skipEmptyLines),typeof a.newline=="string"&&(D=a.newline),typeof a.quoteChar=="string"&&(U=a.quoteChar),typeof a.header=="boolean"&&(m=a.header),Array.isArray(a.columns)){if(a.columns.length===0)throw new Error("Option columns is empty");k=a.columns}a.escapeChar!==void 0&&(et=a.escapeChar+U),a.escapeFormulae instanceof RegExp?z=a.escapeFormulae:typeof a.escapeFormulae=="boolean"&&a.escapeFormulae&&(z=/^[=+\-@\t\r].*$/)}})(),new RegExp(G(U),"g"));if(typeof n=="string"&&(n=JSON.parse(n)),Array.isArray(n)){if(!n.length||Array.isArray(n[0]))return X(null,n,it);if(typeof n[0]=="object")return X(k||Object.keys(n[0]),n,it)}else if(typeof n=="object")return typeof n.data=="string"&&(n.data=JSON.parse(n.data)),Array.isArray(n.data)&&(n.fields||(n.fields=n.meta&&n.meta.fields||k),n.fields||(n.fields=Array.isArray(n.data[0])?n.fields:typeof n.data[0]=="object"?Object.keys(n.data[0]):[]),Array.isArray(n.data[0])||typeof n.data[0]=="object"||(n.data=[n.data])),X(n.fields||[],n.data||[],it);throw new Error("Unable to serialize unrecognized input");function X(M,g,Y){var N="",Z=(typeof M=="string"&&(M=JSON.parse(M)),typeof g=="string"&&(g=JSON.parse(g)),Array.isArray(M)&&0<M.length),st=!Array.isArray(g[0]);if(Z&&m){for(var T=0;T<M.length;T++)0<T&&(N+=p),N+=w(M[T],T);0<g.length&&(N+=D)}for(var L=0;L<g.length;L++){var V=(Z?M:g[L]).length,v=!1,H=Z?Object.keys(g[L]).length===0:g[L].length===0;if(Y&&!Z&&(v=Y==="greedy"?g[L].join("").trim()==="":g[L].length===1&&g[L][0].length===0),Y==="greedy"&&Z){for(var W=[],R=0;R<V;R++){var $=st?M[R]:R;W.push(g[L][$])}v=W.join("").trim()===""}if(!v){for(var A=0;A<V;A++){0<A&&!H&&(N+=p);var nt=Z&&st?M[A]:A;N+=w(g[L][nt],A)}L<g.length-1&&(!Y||0<V&&!H)&&(N+=D)}}return N}function w(M,g){var Y,N;return M==null?"":M.constructor===Date?JSON.stringify(M).slice(1,25):(N=!1,z&&typeof M=="string"&&z.test(M)&&(M="'"+M,N=!0),Y=M.toString().replace(b,et),(N=N||d===!0||typeof d=="function"&&d(M,g)||Array.isArray(d)&&d[g]||((Z,st)=>{for(var T=0;T<st.length;T++)if(-1<Z.indexOf(st[T]))return!0;return!1})(Y,h.BAD_DELIMITERS)||-1<Y.indexOf(p)||Y.charAt(0)===" "||Y.charAt(Y.length-1)===" ")?U+Y+U:Y)}},h.RECORD_SEP="",h.UNIT_SEP="",h.BYTE_ORDER_MARK="\uFEFF",h.BAD_DELIMITERS=["\r",`
`,'"',h.BYTE_ORDER_MARK],h.WORKERS_SUPPORTED=!o&&!!i.Worker,h.NODE_STREAM_INPUT=1,h.LocalChunkSize=10485760,h.RemoteChunkSize=5242880,h.DefaultDelimiter=",",h.Parser=S,h.ParserHandle=j,h.NetworkStreamer=y,h.FileStreamer=_,h.StringStreamer=C,h.ReadableStreamStreamer=I,i.jQuery&&((s=i.jQuery).fn.parse=function(n){var a=n.config||{},d=[];return this.each(function(D){if(!(s(this).prop("tagName").toUpperCase()==="INPUT"&&s(this).attr("type").toLowerCase()==="file"&&i.FileReader)||!this.files||this.files.length===0)return!0;for(var U=0;U<this.files.length;U++)d.push({file:this.files[U],inputElem:this,instanceConfig:s.extend({},a)})}),m(),this;function m(){if(d.length===0)O(n.complete)&&n.complete();else{var D,U,et,it,k=d[0];if(O(n.before)){var z=n.before(k.file,k.inputElem);if(typeof z=="object"){if(z.action==="abort")return D="AbortError",U=k.file,et=k.inputElem,it=z.reason,void(O(n.error)&&n.error({name:D},U,et,it));if(z.action==="skip")return void p();typeof z.config=="object"&&(k.instanceConfig=s.extend(k.instanceConfig,z.config))}else if(z==="skip")return void p()}var b=k.instanceConfig.complete;k.instanceConfig.complete=function(X){O(b)&&b(X,k.file,k.inputElem),p()},h.parse(k.file,k.instanceConfig)}}function p(){d.splice(0,1),m()}}),r&&(i.onmessage=function(n){n=n.data,h.WORKER_ID===void 0&&n&&(h.WORKER_ID=n.workerId),typeof n.input=="string"?i.postMessage({workerId:h.WORKER_ID,results:h.parse(n.input,n.config),finished:!0}):(i.File&&n.input instanceof File||n.input instanceof Object)&&(n=h.parse(n.input,n.config))&&i.postMessage({workerId:h.WORKER_ID,results:n,finished:!0})}),(y.prototype=Object.create(f.prototype)).constructor=y,(_.prototype=Object.create(f.prototype)).constructor=_,(C.prototype=Object.create(C.prototype)).constructor=C,(I.prototype=Object.create(f.prototype)).constructor=I,h})})(St)),St.exports}var Ie=Fe();const je=Oe(Ie);class ze{constructor(){this.data=[],this.dataByTimestamp=new Map,this.isLoaded=!1,this.stats={timeRange:{start:null,end:null},riverDischarge:{min:1/0,max:-1/0},velocity:{min:1/0,max:-1/0},seaLevel:{min:1/0,max:-1/0},temperature:{min:1/0,max:-1/0}}}async loadCSV(t){return console.log("Loading buoy data from:",t),new Promise((e,i)=>{je.parse(t,{download:!0,header:!0,dynamicTyping:!0,skipEmptyLines:!0,complete:s=>{console.log("CSV parsed successfully. Rows:",s.data.length),this.processData(s.data),this.isLoaded=!0,e(this.data)},error:s=>{console.error("Error parsing CSV:",s),i(s)}})})}processData(t){console.log("Processing buoy data..."),t.forEach((e,i)=>{if(!e.time||e.time==="")return;const s=[];for(let r=0;r<256;r++){const c=`z${r}`;s.push(e[c]!==null&&e[c]!==void 0?e[c]:0)}const o={timestamp:new Date(e.time),time:e.time,airTemp:e.avg_air_temp_pst10mts_46131,seaLevel:e["Sand Heads_SLEV"],riverDischarge:e.Q_cms,buoys:{46131:{u:e.u_46131,v:e.v_46131},46146:{u:e.u_46146,v:e.v_46146},46303:{u:e.u_46303,v:e.v_46303},46304:{u:e.u_46304,v:e.v_46304}},spatialGrid:s,month:e.month,hour:e.hour,dayOfYear:e.day_of_year,dayOfWeek:e.day_of_week,cluster:e.cluster,index:i};this.data.push(o),this.dataByTimestamp.set(e.time,o),this.updateStats(o)}),console.log("Processed records:",this.data.length),console.log("Statistics:",this.stats)}updateStats(t){(!this.stats.timeRange.start||t.timestamp<this.stats.timeRange.start)&&(this.stats.timeRange.start=t.timestamp),(!this.stats.timeRange.end||t.timestamp>this.stats.timeRange.end)&&(this.stats.timeRange.end=t.timestamp),t.riverDischarge!==null&&t.riverDischarge!==void 0&&(this.stats.riverDischarge.min=Math.min(this.stats.riverDischarge.min,t.riverDischarge),this.stats.riverDischarge.max=Math.max(this.stats.riverDischarge.max,t.riverDischarge)),t.seaLevel!==null&&t.seaLevel!==void 0&&(this.stats.seaLevel.min=Math.min(this.stats.seaLevel.min,t.seaLevel),this.stats.seaLevel.max=Math.max(this.stats.seaLevel.max,t.seaLevel)),t.airTemp!==null&&t.airTemp!==void 0&&(this.stats.temperature.min=Math.min(this.stats.temperature.min,t.airTemp),this.stats.temperature.max=Math.max(this.stats.temperature.max,t.airTemp)),Object.values(t.buoys).forEach(e=>{if(e.u!==null&&e.u!==void 0&&e.v!==null&&e.v!==void 0){const i=Math.sqrt(e.u*e.u+e.v*e.v);this.stats.velocity.min=Math.min(this.stats.velocity.min,i),this.stats.velocity.max=Math.max(this.stats.velocity.max,i)}})}getRecordByIndex(t){return t<0||t>=this.data.length?null:this.data[t]}getRecordByTimestamp(t){return this.dataByTimestamp.get(t)}getRecordByDate(t){if(this.data.length===0)return null;const e=t.getTime();let i=this.data[0],s=Math.abs(i.timestamp.getTime()-e);for(const o of this.data){const r=Math.abs(o.timestamp.getTime()-e);r<s&&(s=r,i=o)}return i}getClusterName(t){return{0:"Tide + River Dominated",1:"Wind/Storm-Dominated",2:"River Discharge Dominated"}[t]||"Unknown"}getStats(){return this.stats}getTotalRecords(){return this.data.length}getTimeRange(){return this.stats.timeRange}}class Ve{constructor(t=40,e=48){this.targetWidth=t,this.targetHeight=e,this.gridSpacing=2.5,this.sourceWidth=16,this.sourceHeight=16}interpolateToField(t,e){const i=[],s=this.reshapeToGrid(t);for(let o=0;o<this.targetHeight;o++){i[o]=[];for(let r=0;r<this.targetWidth;r++){const c=(r-this.targetWidth/2)*this.gridSpacing,u=(o-this.targetHeight/2)*this.gridSpacing,h=this.bilinearInterpolate(s,r/(this.targetWidth/this.sourceWidth),o/(this.targetHeight/this.sourceHeight)),f=this.gridValueToVelocity(h,c,u,e);i[o][r]={x:c,z:u,u:f.u,v:f.v,magnitude:f.magnitude,gridValue:h}}}return i}reshapeToGrid(t){const e=[];for(let i=0;i<this.sourceHeight;i++){e[i]=[];for(let s=0;s<this.sourceWidth;s++){const o=i*this.sourceWidth+s;e[i][s]=t[o]||0}}return e}bilinearInterpolate(t,e,i){const s=Math.max(0,Math.min(this.sourceWidth-2,Math.floor(e))),o=Math.max(0,Math.min(this.sourceHeight-2,Math.floor(i))),r=s+1,c=o+1,u=e-s,h=i-o,f=t[o][s],y=t[o][r],_=t[c][s],C=t[c][r];return(1-u)*(1-h)*f+u*(1-h)*y+(1-u)*h*_+u*h*C}gridValueToVelocity(t,e,i,s){let o=0,r=0,c=0;Object.values(s).forEach(_=>{_.u!==null&&_.u!==void 0&&_.v!==null&&_.v!==void 0&&(o+=_.u,r+=_.v,c++)}),c>0&&(o/=c,r/=c);const u=1+t*5,h=o*u,f=r*u,y=Math.sqrt(h*h+f*f);return{u:h,v:f,magnitude:y}}interpolateFromBuoys(t,e){const i=[];for(let s=0;s<this.targetHeight;s++){i[s]=[];for(let o=0;o<this.targetWidth;o++){const r=(o-this.targetWidth/2)*this.gridSpacing,c=(s-this.targetHeight/2)*this.gridSpacing,u=this.inverseDistanceWeighting(r,c,t,e);i[s][o]={x:r,z:c,u:u.u,v:u.v,magnitude:u.magnitude}}}return i}inverseDistanceWeighting(t,e,i,s){let o=0,r=0,c=0;Object.entries(i).forEach(([h,f])=>{if(!s[h]||f.u===null||f.v===null)return;const y=s[h],_=t-y.x,C=e-y.z,I=Math.sqrt(_*_+C*C)+.1,j=1/(I*I);r+=f.u*j,c+=f.v*j,o+=j}),o>0&&(r/=o,c/=o);const u=Math.sqrt(r*r+c*c);return{u:r,v:c,magnitude:u}}getVelocityAt(t,e,i){const s=t/this.gridSpacing+this.targetWidth/2,o=e/this.gridSpacing+this.targetHeight/2;if(s<0||s>=this.targetWidth-1||o<0||o>=this.targetHeight-1)return{u:0,v:0,magnitude:0};const r=Math.floor(o),c=Math.floor(s),u=s-c,h=o-r,f=i[r][c],y=i[r][c+1],_=i[r+1][c],C=i[r+1][c+1],I=(1-u)*(1-h)*f.u+u*(1-h)*y.u+(1-u)*h*_.u+u*h*C.u,j=(1-u)*(1-h)*f.v+u*(1-h)*y.v+(1-u)*h*_.v+u*h*C.v,G=Math.sqrt(I*I+j*j);return{u:I,v:j,magnitude:G}}getMaxVelocity(t){let e=0;for(let i=0;i<t.length;i++)for(let s=0;s<t[i].length;s++)t[i][s].magnitude>e&&(e=t[i][s].magnitude);return e}}/**
 * lil-gui
 * https://lil-gui.georgealways.com
 * @version 0.21.0
 * @author George Michael Brower
 * @license MIT
 */class dt{constructor(t,e,i,s,o="div"){this.parent=t,this.object=e,this.property=i,this._disabled=!1,this._hidden=!1,this.initialValue=this.getValue(),this.domElement=document.createElement(o),this.domElement.classList.add("lil-controller"),this.domElement.classList.add(s),this.$name=document.createElement("div"),this.$name.classList.add("lil-name"),dt.nextNameID=dt.nextNameID||0,this.$name.id=`lil-gui-name-${++dt.nextNameID}`,this.$widget=document.createElement("div"),this.$widget.classList.add("lil-widget"),this.$disable=this.$widget,this.domElement.appendChild(this.$name),this.domElement.appendChild(this.$widget),this.domElement.addEventListener("keydown",r=>r.stopPropagation()),this.domElement.addEventListener("keyup",r=>r.stopPropagation()),this.parent.children.push(this),this.parent.controllers.push(this),this.parent.$children.appendChild(this.domElement),this._listenCallback=this._listenCallback.bind(this),this.name(i)}name(t){return this._name=t,this.$name.textContent=t,this}onChange(t){return this._onChange=t,this}_callOnChange(){this.parent._callOnChange(this),this._onChange!==void 0&&this._onChange.call(this,this.getValue()),this._changed=!0}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(){this._changed&&(this.parent._callOnFinishChange(this),this._onFinishChange!==void 0&&this._onFinishChange.call(this,this.getValue())),this._changed=!1}reset(){return this.setValue(this.initialValue),this._callOnFinishChange(),this}enable(t=!0){return this.disable(!t)}disable(t=!0){return t===this._disabled?this:(this._disabled=t,this.domElement.classList.toggle("lil-disabled",t),this.$disable.toggleAttribute("disabled",t),this)}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}options(t){const e=this.parent.add(this.object,this.property,t);return e.name(this._name),this.destroy(),e}min(t){return this}max(t){return this}step(t){return this}decimals(t){return this}listen(t=!0){return this._listening=t,this._listenCallbackID!==void 0&&(cancelAnimationFrame(this._listenCallbackID),this._listenCallbackID=void 0),this._listening&&this._listenCallback(),this}_listenCallback(){this._listenCallbackID=requestAnimationFrame(this._listenCallback);const t=this.save();t!==this._listenPrevValue&&this.updateDisplay(),this._listenPrevValue=t}getValue(){return this.object[this.property]}setValue(t){return this.getValue()!==t&&(this.object[this.property]=t,this._callOnChange(),this.updateDisplay()),this}updateDisplay(){return this}load(t){return this.setValue(t),this._callOnFinishChange(),this}save(){return this.getValue()}destroy(){this.listen(!1),this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.controllers.splice(this.parent.controllers.indexOf(this),1),this.parent.$children.removeChild(this.domElement)}}class He extends dt{constructor(t,e,i){super(t,e,i,"lil-boolean","label"),this.$input=document.createElement("input"),this.$input.setAttribute("type","checkbox"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$widget.appendChild(this.$input),this.$input.addEventListener("change",()=>{this.setValue(this.$input.checked),this._callOnFinishChange()}),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.checked=this.getValue(),this}}function Pt(l){let t,e;return(t=l.match(/(#|0x)?([a-f0-9]{6})/i))?e=t[2]:(t=l.match(/rgb\(\s*(\d*)\s*,\s*(\d*)\s*,\s*(\d*)\s*\)/))?e=parseInt(t[1]).toString(16).padStart(2,0)+parseInt(t[2]).toString(16).padStart(2,0)+parseInt(t[3]).toString(16).padStart(2,0):(t=l.match(/^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i))&&(e=t[1]+t[1]+t[2]+t[2]+t[3]+t[3]),e?"#"+e:!1}const Ne={isPrimitive:!0,match:l=>typeof l=="string",fromHexString:Pt,toHexString:Pt},Et={isPrimitive:!0,match:l=>typeof l=="number",fromHexString:l=>parseInt(l.substring(1),16),toHexString:l=>"#"+l.toString(16).padStart(6,0)},Be={isPrimitive:!1,match:l=>Array.isArray(l)||ArrayBuffer.isView(l),fromHexString(l,t,e=1){const i=Et.fromHexString(l);t[0]=(i>>16&255)/255*e,t[1]=(i>>8&255)/255*e,t[2]=(i&255)/255*e},toHexString([l,t,e],i=1){i=255/i;const s=l*i<<16^t*i<<8^e*i<<0;return Et.toHexString(s)}},Ue={isPrimitive:!1,match:l=>Object(l)===l,fromHexString(l,t,e=1){const i=Et.fromHexString(l);t.r=(i>>16&255)/255*e,t.g=(i>>8&255)/255*e,t.b=(i&255)/255*e},toHexString({r:l,g:t,b:e},i=1){i=255/i;const s=l*i<<16^t*i<<8^e*i<<0;return Et.toHexString(s)}},Ye=[Ne,Et,Be,Ue];function We(l){return Ye.find(t=>t.match(l))}class qe extends dt{constructor(t,e,i,s){super(t,e,i,"lil-color"),this.$input=document.createElement("input"),this.$input.setAttribute("type","color"),this.$input.setAttribute("tabindex",-1),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$text=document.createElement("input"),this.$text.setAttribute("type","text"),this.$text.setAttribute("spellcheck","false"),this.$text.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("lil-display"),this.$display.appendChild(this.$input),this.$widget.appendChild(this.$display),this.$widget.appendChild(this.$text),this._format=We(this.initialValue),this._rgbScale=s,this._initialValueHexString=this.save(),this._textFocused=!1,this.$input.addEventListener("input",()=>{this._setValueFromHexString(this.$input.value)}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$text.addEventListener("input",()=>{const o=Pt(this.$text.value);o&&this._setValueFromHexString(o)}),this.$text.addEventListener("focus",()=>{this._textFocused=!0,this.$text.select()}),this.$text.addEventListener("blur",()=>{this._textFocused=!1,this.updateDisplay(),this._callOnFinishChange()}),this.$disable=this.$text,this.updateDisplay()}reset(){return this._setValueFromHexString(this._initialValueHexString),this}_setValueFromHexString(t){if(this._format.isPrimitive){const e=this._format.fromHexString(t);this.setValue(e)}else this._format.fromHexString(t,this.getValue(),this._rgbScale),this._callOnChange(),this.updateDisplay()}save(){return this._format.toHexString(this.getValue(),this._rgbScale)}load(t){return this._setValueFromHexString(t),this._callOnFinishChange(),this}updateDisplay(){return this.$input.value=this._format.toHexString(this.getValue(),this._rgbScale),this._textFocused||(this.$text.value=this.$input.value.substring(1)),this.$display.style.backgroundColor=this.$input.value,this}}class At extends dt{constructor(t,e,i){super(t,e,i,"lil-function"),this.$button=document.createElement("button"),this.$button.appendChild(this.$name),this.$widget.appendChild(this.$button),this.$button.addEventListener("click",s=>{s.preventDefault(),this.getValue().call(this.object),this._callOnChange()}),this.$button.addEventListener("touchstart",()=>{},{passive:!0}),this.$disable=this.$button}}class Ke extends dt{constructor(t,e,i,s,o,r){super(t,e,i,"lil-number"),this._initInput(),this.min(s),this.max(o);const c=r!==void 0;this.step(c?r:this._getImplicitStep(),c),this.updateDisplay()}decimals(t){return this._decimals=t,this.updateDisplay(),this}min(t){return this._min=t,this._onUpdateMinMax(),this}max(t){return this._max=t,this._onUpdateMinMax(),this}step(t,e=!0){return this._step=t,this._stepExplicit=e,this}updateDisplay(){const t=this.getValue();if(this._hasSlider){let e=(t-this._min)/(this._max-this._min);e=Math.max(0,Math.min(e,1)),this.$fill.style.width=e*100+"%"}return this._inputFocused||(this.$input.value=this._decimals===void 0?t:t.toFixed(this._decimals)),this}_initInput(){this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("aria-labelledby",this.$name.id),window.matchMedia("(pointer: coarse)").matches&&(this.$input.setAttribute("type","number"),this.$input.setAttribute("step","any")),this.$widget.appendChild(this.$input),this.$disable=this.$input;const e=()=>{let x=parseFloat(this.$input.value);isNaN(x)||(this._stepExplicit&&(x=this._snap(x)),this.setValue(this._clamp(x)))},i=x=>{const B=parseFloat(this.$input.value);isNaN(B)||(this._snapClampSetValue(B+x),this.$input.value=this.getValue())},s=x=>{x.key==="Enter"&&this.$input.blur(),x.code==="ArrowUp"&&(x.preventDefault(),i(this._step*this._arrowKeyMultiplier(x))),x.code==="ArrowDown"&&(x.preventDefault(),i(this._step*this._arrowKeyMultiplier(x)*-1))},o=x=>{this._inputFocused&&(x.preventDefault(),i(this._step*this._normalizeMouseWheel(x)))};let r=!1,c,u,h,f,y;const _=5,C=x=>{c=x.clientX,u=h=x.clientY,r=!0,f=this.getValue(),y=0,window.addEventListener("mousemove",I),window.addEventListener("mouseup",j)},I=x=>{if(r){const B=x.clientX-c,mt=x.clientY-u;Math.abs(mt)>_?(x.preventDefault(),this.$input.blur(),r=!1,this._setDraggingStyle(!0,"vertical")):Math.abs(B)>_&&j()}if(!r){const B=x.clientY-h;y-=B*this._step*this._arrowKeyMultiplier(x),f+y>this._max?y=this._max-f:f+y<this._min&&(y=this._min-f),this._snapClampSetValue(f+y)}h=x.clientY},j=()=>{this._setDraggingStyle(!1,"vertical"),this._callOnFinishChange(),window.removeEventListener("mousemove",I),window.removeEventListener("mouseup",j)},G=()=>{this._inputFocused=!0},S=()=>{this._inputFocused=!1,this.updateDisplay(),this._callOnFinishChange()};this.$input.addEventListener("input",e),this.$input.addEventListener("keydown",s),this.$input.addEventListener("wheel",o,{passive:!1}),this.$input.addEventListener("mousedown",C),this.$input.addEventListener("focus",G),this.$input.addEventListener("blur",S)}_initSlider(){this._hasSlider=!0,this.$slider=document.createElement("div"),this.$slider.classList.add("lil-slider"),this.$fill=document.createElement("div"),this.$fill.classList.add("lil-fill"),this.$slider.appendChild(this.$fill),this.$widget.insertBefore(this.$slider,this.$input),this.domElement.classList.add("lil-has-slider");const t=(S,x,B,mt,vt)=>(S-x)/(B-x)*(vt-mt)+mt,e=S=>{const x=this.$slider.getBoundingClientRect();let B=t(S,x.left,x.right,this._min,this._max);this._snapClampSetValue(B)},i=S=>{this._setDraggingStyle(!0),e(S.clientX),window.addEventListener("mousemove",s),window.addEventListener("mouseup",o)},s=S=>{e(S.clientX)},o=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("mousemove",s),window.removeEventListener("mouseup",o)};let r=!1,c,u;const h=S=>{S.preventDefault(),this._setDraggingStyle(!0),e(S.touches[0].clientX),r=!1},f=S=>{S.touches.length>1||(this._hasScrollBar?(c=S.touches[0].clientX,u=S.touches[0].clientY,r=!0):h(S),window.addEventListener("touchmove",y,{passive:!1}),window.addEventListener("touchend",_))},y=S=>{if(r){const x=S.touches[0].clientX-c,B=S.touches[0].clientY-u;Math.abs(x)>Math.abs(B)?h(S):(window.removeEventListener("touchmove",y),window.removeEventListener("touchend",_))}else S.preventDefault(),e(S.touches[0].clientX)},_=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("touchmove",y),window.removeEventListener("touchend",_)},C=this._callOnFinishChange.bind(this),I=400;let j;const G=S=>{if(Math.abs(S.deltaX)<Math.abs(S.deltaY)&&this._hasScrollBar)return;S.preventDefault();const B=this._normalizeMouseWheel(S)*this._step;this._snapClampSetValue(this.getValue()+B),this.$input.value=this.getValue(),clearTimeout(j),j=setTimeout(C,I)};this.$slider.addEventListener("mousedown",i),this.$slider.addEventListener("touchstart",f,{passive:!1}),this.$slider.addEventListener("wheel",G,{passive:!1})}_setDraggingStyle(t,e="horizontal"){this.$slider&&this.$slider.classList.toggle("lil-active",t),document.body.classList.toggle("lil-dragging",t),document.body.classList.toggle(`lil-${e}`,t)}_getImplicitStep(){return this._hasMin&&this._hasMax?(this._max-this._min)/1e3:.1}_onUpdateMinMax(){!this._hasSlider&&this._hasMin&&this._hasMax&&(this._stepExplicit||this.step(this._getImplicitStep(),!1),this._initSlider(),this.updateDisplay())}_normalizeMouseWheel(t){let{deltaX:e,deltaY:i}=t;return Math.floor(t.deltaY)!==t.deltaY&&t.wheelDelta&&(e=0,i=-t.wheelDelta/120,i*=this._stepExplicit?1:10),e+-i}_arrowKeyMultiplier(t){let e=this._stepExplicit?1:10;return t.shiftKey?e*=10:t.altKey&&(e/=10),e}_snap(t){let e=0;return this._hasMin?e=this._min:this._hasMax&&(e=this._max),t-=e,t=Math.round(t/this._step)*this._step,t+=e,t=parseFloat(t.toPrecision(15)),t}_clamp(t){return t<this._min&&(t=this._min),t>this._max&&(t=this._max),t}_snapClampSetValue(t){this.setValue(this._clamp(this._snap(t)))}get _hasScrollBar(){const t=this.parent.root.$children;return t.scrollHeight>t.clientHeight}get _hasMin(){return this._min!==void 0}get _hasMax(){return this._max!==void 0}}class Ge extends dt{constructor(t,e,i,s){super(t,e,i,"lil-option"),this.$select=document.createElement("select"),this.$select.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("lil-display"),this.$select.addEventListener("change",()=>{this.setValue(this._values[this.$select.selectedIndex]),this._callOnFinishChange()}),this.$select.addEventListener("focus",()=>{this.$display.classList.add("lil-focus")}),this.$select.addEventListener("blur",()=>{this.$display.classList.remove("lil-focus")}),this.$widget.appendChild(this.$select),this.$widget.appendChild(this.$display),this.$disable=this.$select,this.options(s)}options(t){return this._values=Array.isArray(t)?t:Object.values(t),this._names=Array.isArray(t)?t:Object.keys(t),this.$select.replaceChildren(),this._names.forEach(e=>{const i=document.createElement("option");i.textContent=e,this.$select.appendChild(i)}),this.updateDisplay(),this}updateDisplay(){const t=this.getValue(),e=this._values.indexOf(t);return this.$select.selectedIndex=e,this.$display.textContent=e===-1?t:this._names[e],this}}class Ze extends dt{constructor(t,e,i){super(t,e,i,"lil-string"),this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("spellcheck","false"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$input.addEventListener("input",()=>{this.setValue(this.$input.value)}),this.$input.addEventListener("keydown",s=>{s.code==="Enter"&&this.$input.blur()}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$widget.appendChild(this.$input),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.value=this.getValue(),this}}var Xe=`.lil-gui {
  font-family: var(--font-family);
  font-size: var(--font-size);
  line-height: 1;
  font-weight: normal;
  font-style: normal;
  text-align: left;
  color: var(--text-color);
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  --background-color: #1f1f1f;
  --text-color: #ebebeb;
  --title-background-color: #111111;
  --title-text-color: #ebebeb;
  --widget-color: #424242;
  --hover-color: #4f4f4f;
  --focus-color: #595959;
  --number-color: #2cc9ff;
  --string-color: #a2db3c;
  --font-size: 11px;
  --input-font-size: 11px;
  --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
  --font-family-mono: Menlo, Monaco, Consolas, "Droid Sans Mono", monospace;
  --padding: 4px;
  --spacing: 4px;
  --widget-height: 20px;
  --title-height: calc(var(--widget-height) + var(--spacing) * 1.25);
  --name-width: 45%;
  --slider-knob-width: 2px;
  --slider-input-width: 27%;
  --color-input-width: 27%;
  --slider-input-min-width: 45px;
  --color-input-min-width: 45px;
  --folder-indent: 7px;
  --widget-padding: 0 0 0 3px;
  --widget-border-radius: 2px;
  --checkbox-size: calc(0.75 * var(--widget-height));
  --scrollbar-width: 5px;
}
.lil-gui, .lil-gui * {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
.lil-gui.lil-root {
  width: var(--width, 245px);
  display: flex;
  flex-direction: column;
  background: var(--background-color);
}
.lil-gui.lil-root > .lil-title {
  background: var(--title-background-color);
  color: var(--title-text-color);
}
.lil-gui.lil-root > .lil-children {
  overflow-x: hidden;
  overflow-y: auto;
}
.lil-gui.lil-root > .lil-children::-webkit-scrollbar {
  width: var(--scrollbar-width);
  height: var(--scrollbar-width);
  background: var(--background-color);
}
.lil-gui.lil-root > .lil-children::-webkit-scrollbar-thumb {
  border-radius: var(--scrollbar-width);
  background: var(--focus-color);
}
@media (pointer: coarse) {
  .lil-gui.lil-allow-touch-styles, .lil-gui.lil-allow-touch-styles .lil-gui {
    --widget-height: 28px;
    --padding: 6px;
    --spacing: 6px;
    --font-size: 13px;
    --input-font-size: 16px;
    --folder-indent: 10px;
    --scrollbar-width: 7px;
    --slider-input-min-width: 50px;
    --color-input-min-width: 65px;
  }
}
.lil-gui.lil-force-touch-styles, .lil-gui.lil-force-touch-styles .lil-gui {
  --widget-height: 28px;
  --padding: 6px;
  --spacing: 6px;
  --font-size: 13px;
  --input-font-size: 16px;
  --folder-indent: 10px;
  --scrollbar-width: 7px;
  --slider-input-min-width: 50px;
  --color-input-min-width: 65px;
}
.lil-gui.lil-auto-place, .lil-gui.autoPlace {
  max-height: 100%;
  position: fixed;
  top: 0;
  right: 15px;
  z-index: 1001;
}

.lil-controller {
  display: flex;
  align-items: center;
  padding: 0 var(--padding);
  margin: var(--spacing) 0;
}
.lil-controller.lil-disabled {
  opacity: 0.5;
}
.lil-controller.lil-disabled, .lil-controller.lil-disabled * {
  pointer-events: none !important;
}
.lil-controller > .lil-name {
  min-width: var(--name-width);
  flex-shrink: 0;
  white-space: pre;
  padding-right: var(--spacing);
  line-height: var(--widget-height);
}
.lil-controller .lil-widget {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  min-height: var(--widget-height);
}
.lil-controller.lil-string input {
  color: var(--string-color);
}
.lil-controller.lil-boolean {
  cursor: pointer;
}
.lil-controller.lil-color .lil-display {
  width: 100%;
  height: var(--widget-height);
  border-radius: var(--widget-border-radius);
  position: relative;
}
@media (hover: hover) {
  .lil-controller.lil-color .lil-display:hover:before {
    content: " ";
    display: block;
    position: absolute;
    border-radius: var(--widget-border-radius);
    border: 1px solid #fff9;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
}
.lil-controller.lil-color input[type=color] {
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}
.lil-controller.lil-color input[type=text] {
  margin-left: var(--spacing);
  font-family: var(--font-family-mono);
  min-width: var(--color-input-min-width);
  width: var(--color-input-width);
  flex-shrink: 0;
}
.lil-controller.lil-option select {
  opacity: 0;
  position: absolute;
  width: 100%;
  max-width: 100%;
}
.lil-controller.lil-option .lil-display {
  position: relative;
  pointer-events: none;
  border-radius: var(--widget-border-radius);
  height: var(--widget-height);
  line-height: var(--widget-height);
  max-width: 100%;
  overflow: hidden;
  word-break: break-all;
  padding-left: 0.55em;
  padding-right: 1.75em;
  background: var(--widget-color);
}
@media (hover: hover) {
  .lil-controller.lil-option .lil-display.lil-focus {
    background: var(--focus-color);
  }
}
.lil-controller.lil-option .lil-display.lil-active {
  background: var(--focus-color);
}
.lil-controller.lil-option .lil-display:after {
  font-family: "lil-gui";
  content: "↕";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  padding-right: 0.375em;
}
.lil-controller.lil-option .lil-widget,
.lil-controller.lil-option select {
  cursor: pointer;
}
@media (hover: hover) {
  .lil-controller.lil-option .lil-widget:hover .lil-display {
    background: var(--hover-color);
  }
}
.lil-controller.lil-number input {
  color: var(--number-color);
}
.lil-controller.lil-number.lil-has-slider input {
  margin-left: var(--spacing);
  width: var(--slider-input-width);
  min-width: var(--slider-input-min-width);
  flex-shrink: 0;
}
.lil-controller.lil-number .lil-slider {
  width: 100%;
  height: var(--widget-height);
  background: var(--widget-color);
  border-radius: var(--widget-border-radius);
  padding-right: var(--slider-knob-width);
  overflow: hidden;
  cursor: ew-resize;
  touch-action: pan-y;
}
@media (hover: hover) {
  .lil-controller.lil-number .lil-slider:hover {
    background: var(--hover-color);
  }
}
.lil-controller.lil-number .lil-slider.lil-active {
  background: var(--focus-color);
}
.lil-controller.lil-number .lil-slider.lil-active .lil-fill {
  opacity: 0.95;
}
.lil-controller.lil-number .lil-fill {
  height: 100%;
  border-right: var(--slider-knob-width) solid var(--number-color);
  box-sizing: content-box;
}

.lil-dragging .lil-gui {
  --hover-color: var(--widget-color);
}
.lil-dragging * {
  cursor: ew-resize !important;
}
.lil-dragging.lil-vertical * {
  cursor: ns-resize !important;
}

.lil-gui .lil-title {
  height: var(--title-height);
  font-weight: 600;
  padding: 0 var(--padding);
  width: 100%;
  text-align: left;
  background: none;
  text-decoration-skip: objects;
}
.lil-gui .lil-title:before {
  font-family: "lil-gui";
  content: "▾";
  padding-right: 2px;
  display: inline-block;
}
.lil-gui .lil-title:active {
  background: var(--title-background-color);
  opacity: 0.75;
}
@media (hover: hover) {
  body:not(.lil-dragging) .lil-gui .lil-title:hover {
    background: var(--title-background-color);
    opacity: 0.85;
  }
  .lil-gui .lil-title:focus {
    text-decoration: underline var(--focus-color);
  }
}
.lil-gui.lil-root > .lil-title:focus {
  text-decoration: none !important;
}
.lil-gui.lil-closed > .lil-title:before {
  content: "▸";
}
.lil-gui.lil-closed > .lil-children {
  transform: translateY(-7px);
  opacity: 0;
}
.lil-gui.lil-closed:not(.lil-transition) > .lil-children {
  display: none;
}
.lil-gui.lil-transition > .lil-children {
  transition-duration: 300ms;
  transition-property: height, opacity, transform;
  transition-timing-function: cubic-bezier(0.2, 0.6, 0.35, 1);
  overflow: hidden;
  pointer-events: none;
}
.lil-gui .lil-children:empty:before {
  content: "Empty";
  padding: 0 var(--padding);
  margin: var(--spacing) 0;
  display: block;
  height: var(--widget-height);
  font-style: italic;
  line-height: var(--widget-height);
  opacity: 0.5;
}
.lil-gui.lil-root > .lil-children > .lil-gui > .lil-title {
  border: 0 solid var(--widget-color);
  border-width: 1px 0;
  transition: border-color 300ms;
}
.lil-gui.lil-root > .lil-children > .lil-gui.lil-closed > .lil-title {
  border-bottom-color: transparent;
}
.lil-gui + .lil-controller {
  border-top: 1px solid var(--widget-color);
  margin-top: 0;
  padding-top: var(--spacing);
}
.lil-gui .lil-gui .lil-gui > .lil-title {
  border: none;
}
.lil-gui .lil-gui .lil-gui > .lil-children {
  border: none;
  margin-left: var(--folder-indent);
  border-left: 2px solid var(--widget-color);
}
.lil-gui .lil-gui .lil-controller {
  border: none;
}

.lil-gui label, .lil-gui input, .lil-gui button {
  -webkit-tap-highlight-color: transparent;
}
.lil-gui input {
  border: 0;
  outline: none;
  font-family: var(--font-family);
  font-size: var(--input-font-size);
  border-radius: var(--widget-border-radius);
  height: var(--widget-height);
  background: var(--widget-color);
  color: var(--text-color);
  width: 100%;
}
@media (hover: hover) {
  .lil-gui input:hover {
    background: var(--hover-color);
  }
  .lil-gui input:active {
    background: var(--focus-color);
  }
}
.lil-gui input:disabled {
  opacity: 1;
}
.lil-gui input[type=text],
.lil-gui input[type=number] {
  padding: var(--widget-padding);
  -moz-appearance: textfield;
}
.lil-gui input[type=text]:focus,
.lil-gui input[type=number]:focus {
  background: var(--focus-color);
}
.lil-gui input[type=checkbox] {
  appearance: none;
  width: var(--checkbox-size);
  height: var(--checkbox-size);
  border-radius: var(--widget-border-radius);
  text-align: center;
  cursor: pointer;
}
.lil-gui input[type=checkbox]:checked:before {
  font-family: "lil-gui";
  content: "✓";
  font-size: var(--checkbox-size);
  line-height: var(--checkbox-size);
}
@media (hover: hover) {
  .lil-gui input[type=checkbox]:focus {
    box-shadow: inset 0 0 0 1px var(--focus-color);
  }
}
.lil-gui button {
  outline: none;
  cursor: pointer;
  font-family: var(--font-family);
  font-size: var(--font-size);
  color: var(--text-color);
  width: 100%;
  border: none;
}
.lil-gui .lil-controller button {
  height: var(--widget-height);
  text-transform: none;
  background: var(--widget-color);
  border-radius: var(--widget-border-radius);
}
@media (hover: hover) {
  .lil-gui .lil-controller button:hover {
    background: var(--hover-color);
  }
  .lil-gui .lil-controller button:focus {
    box-shadow: inset 0 0 0 1px var(--focus-color);
  }
}
.lil-gui .lil-controller button:active {
  background: var(--focus-color);
}

@font-face {
  font-family: "lil-gui";
  src: url("data:application/font-woff2;charset=utf-8;base64,d09GMgABAAAAAALkAAsAAAAABtQAAAKVAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHFQGYACDMgqBBIEbATYCJAMUCwwABCAFhAoHgQQbHAbIDiUFEYVARAAAYQTVWNmz9MxhEgodq49wYRUFKE8GWNiUBxI2LBRaVnc51U83Gmhs0Q7JXWMiz5eteLwrKwuxHO8VFxUX9UpZBs6pa5ABRwHA+t3UxUnH20EvVknRerzQgX6xC/GH6ZUvTcAjAv122dF28OTqCXrPuyaDER30YBA1xnkVutDDo4oCi71Ca7rrV9xS8dZHbPHefsuwIyCpmT7j+MnjAH5X3984UZoFFuJ0yiZ4XEJFxjagEBeqs+e1iyK8Xf/nOuwF+vVK0ur765+vf7txotUi0m3N0m/84RGSrBCNrh8Ee5GjODjF4gnWP+dJrH/Lk9k4oT6d+gr6g/wssA2j64JJGP6cmx554vUZnpZfn6ZfX2bMwPPrlANsB86/DiHjhl0OP+c87+gaJo/gY084s3HoYL/ZkWHTRfBXvvoHnnkHvngKun4KBE/ede7tvq3/vQOxDXB1/fdNz6XbPdcr0Vhpojj9dG+owuSKFsslCi1tgEjirjXdwMiov2EioadxmqTHUCIwo8NgQaeIasAi0fTYSPTbSmwbMOFduyh9wvBrESGY0MtgRjtgQR8Q1bRPohn2UoCRZf9wyYANMXFeJTysqAe0I4mrherOekFdKMrYvJjLvOIUM9SuwYB5DVZUwwVjJJOaUnZCmcEkIZZrKqNvRGRMvmFZsmhP4VMKCSXBhSqUBxgMS7h0cZvEd71AWkEhGWaeMFcNnpqyJkyXgYL7PQ1MoSq0wDAkRtJIijkZSmqYTiSImfLiSWXIZwhRh3Rug2X0kk1Dgj+Iu43u5p98ghopcpSo0Uyc8SnjlYX59WUeaMoDqmVD2TOWD9a4pCRAzf2ECgwGcrHjPOWY9bNxq/OL3I/QjwEAAAA=") format("woff2");
}`;function Qe(l){const t=document.createElement("style");t.innerHTML=l;const e=document.querySelector("head link[rel=stylesheet], head style");e?document.head.insertBefore(t,e):document.head.appendChild(t)}let Yt=!1;class Ot{constructor({parent:t,autoPlace:e=t===void 0,container:i,width:s,title:o="Controls",closeFolders:r=!1,injectStyles:c=!0,touchStyles:u=!0}={}){if(this.parent=t,this.root=t?t.root:this,this.children=[],this.controllers=[],this.folders=[],this._closed=!1,this._hidden=!1,this.domElement=document.createElement("div"),this.domElement.classList.add("lil-gui"),this.$title=document.createElement("button"),this.$title.classList.add("lil-title"),this.$title.setAttribute("aria-expanded",!0),this.$title.addEventListener("click",()=>this.openAnimated(this._closed)),this.$title.addEventListener("touchstart",()=>{},{passive:!0}),this.$children=document.createElement("div"),this.$children.classList.add("lil-children"),this.domElement.appendChild(this.$title),this.domElement.appendChild(this.$children),this.title(o),this.parent){this.parent.children.push(this),this.parent.folders.push(this),this.parent.$children.appendChild(this.domElement);return}this.domElement.classList.add("lil-root"),u&&this.domElement.classList.add("lil-allow-touch-styles"),!Yt&&c&&(Qe(Xe),Yt=!0),i?i.appendChild(this.domElement):e&&(this.domElement.classList.add("lil-auto-place","autoPlace"),document.body.appendChild(this.domElement)),s&&this.domElement.style.setProperty("--width",s+"px"),this._closeFolders=r}add(t,e,i,s,o){if(Object(i)===i)return new Ge(this,t,e,i);const r=t[e];switch(typeof r){case"number":return new Ke(this,t,e,i,s,o);case"boolean":return new He(this,t,e);case"string":return new Ze(this,t,e);case"function":return new At(this,t,e)}console.error(`gui.add failed
	property:`,e,`
	object:`,t,`
	value:`,r)}addColor(t,e,i=1){return new qe(this,t,e,i)}addFolder(t){const e=new Ot({parent:this,title:t});return this.root._closeFolders&&e.close(),e}load(t,e=!0){return t.controllers&&this.controllers.forEach(i=>{i instanceof At||i._name in t.controllers&&i.load(t.controllers[i._name])}),e&&t.folders&&this.folders.forEach(i=>{i._title in t.folders&&i.load(t.folders[i._title])}),this}save(t=!0){const e={controllers:{},folders:{}};return this.controllers.forEach(i=>{if(!(i instanceof At)){if(i._name in e.controllers)throw new Error(`Cannot save GUI with duplicate property "${i._name}"`);e.controllers[i._name]=i.save()}}),t&&this.folders.forEach(i=>{if(i._title in e.folders)throw new Error(`Cannot save GUI with duplicate folder "${i._title}"`);e.folders[i._title]=i.save()}),e}open(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),this.domElement.classList.toggle("lil-closed",this._closed),this}close(){return this.open(!1)}_setClosed(t){this._closed!==t&&(this._closed=t,this._callOnOpenClose(this))}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}openAnimated(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),requestAnimationFrame(()=>{const e=this.$children.clientHeight;this.$children.style.height=e+"px",this.domElement.classList.add("lil-transition");const i=o=>{o.target===this.$children&&(this.$children.style.height="",this.domElement.classList.remove("lil-transition"),this.$children.removeEventListener("transitionend",i))};this.$children.addEventListener("transitionend",i);const s=t?this.$children.scrollHeight:0;this.domElement.classList.toggle("lil-closed",!t),requestAnimationFrame(()=>{this.$children.style.height=s+"px"})}),this}title(t){return this._title=t,this.$title.textContent=t,this}reset(t=!0){return(t?this.controllersRecursive():this.controllers).forEach(i=>i.reset()),this}onChange(t){return this._onChange=t,this}_callOnChange(t){this.parent&&this.parent._callOnChange(t),this._onChange!==void 0&&this._onChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(t){this.parent&&this.parent._callOnFinishChange(t),this._onFinishChange!==void 0&&this._onFinishChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onOpenClose(t){return this._onOpenClose=t,this}_callOnOpenClose(t){this.parent&&this.parent._callOnOpenClose(t),this._onOpenClose!==void 0&&this._onOpenClose.call(this,t)}destroy(){this.parent&&(this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.folders.splice(this.parent.folders.indexOf(this),1)),this.domElement.parentElement&&this.domElement.parentElement.removeChild(this.domElement),Array.from(this.children).forEach(t=>t.destroy())}controllersRecursive(){let t=Array.from(this.controllers);return this.folders.forEach(e=>{t=t.concat(e.controllersRecursive())}),t}foldersRecursive(){let t=Array.from(this.folders);return this.folders.forEach(e=>{t=t.concat(e.foldersRecursive())}),t}}class Je{constructor(t,e){this.params=t,this.updateCallback=e,this.gui=new Ot({title:"Visualization Controls"}),this.setupControls()}setupControls(){const t=this.gui.addFolder("Display Options");t.add(this.params,"showParticles").name("Show Particles").onChange(()=>this.updateCallback()),t.add(this.params,"showVectors").name("Show Vectors").onChange(()=>this.updateCallback()),t.add(this.params,"particleCount",1e3,2e4,1e3).name("Particle Count").onChange(()=>{console.log("Particle count change requires restart")}),t.open();const e=this.gui.addFolder("About");e.add({info:"Real buoy data from 2023-2024"},"info").name("Data Source").disable(),e.add({records:"17,494 hourly records"},"records").name("Dataset").disable(),e.open()}destroy(){this.gui.destroy()}}class ti{constructor(t,e){this.buoyDataLoader=t,this.onTimeChange=e,this.createControls()}createControls(){this.container=document.createElement("div"),this.container.id="timeline-control",this.container.style.cssText=`
            position: absolute;
            bottom: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.75);
            color: white;
            padding: 20px;
            border-radius: 10px;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            font-size: 14px;
            min-width: 400px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(79, 195, 247, 0.3);
            z-index: 100;
        `;const t=document.createElement("h3");t.textContent="Timeline Playback",t.style.cssText=`
            margin: 0 0 15px 0;
            color: #4fc3f7;
            font-size: 18px;
            border-bottom: 2px solid #4fc3f7;
            padding-bottom: 8px;
        `,this.container.appendChild(t),this.timeDisplay=document.createElement("div"),this.timeDisplay.style.cssText=`
            margin-bottom: 15px;
            font-size: 16px;
            font-weight: bold;
            color: #81c784;
            text-align: center;
        `,this.container.appendChild(this.timeDisplay);const e=document.createElement("div");e.style.cssText="margin-bottom: 15px;",this.slider=document.createElement("input"),this.slider.type="range",this.slider.min="0",this.slider.max=String(this.buoyDataLoader.getTotalRecords()-1),this.slider.value="0",this.slider.style.cssText=`
            width: 100%;
            height: 8px;
            border-radius: 5px;
            background: linear-gradient(90deg, #4fc3f7, #81c784);
            outline: none;
            cursor: pointer;
        `,this.slider.addEventListener("input",_=>{const C=parseInt(_.target.value);this.onTimeChange(C),this.updateDisplay(C)}),e.appendChild(this.slider),this.container.appendChild(e);const i=this.buoyDataLoader.getStats(),s=document.createElement("div");s.style.cssText=`
            display: flex;
            justify-content: space-between;
            font-size: 11px;
            color: #aaa;
            margin-bottom: 15px;
        `,s.innerHTML=`
            <span>${this.formatDate(i.timeRange.start)}</span>
            <span>${this.formatDate(i.timeRange.end)}</span>
        `,this.container.appendChild(s);const o=document.createElement("div");o.style.cssText=`
            display: flex;
            gap: 10px;
            align-items: center;
            justify-content: center;
            margin-bottom: 15px;
        `,this.playButton=this.createButton("▶ Play",()=>this.togglePlayback()),o.appendChild(this.playButton);const r=this.createButton("◀",()=>this.stepBackward());r.style.width="40px",o.appendChild(r);const c=this.createButton("▶",()=>this.stepForward());c.style.width="40px",o.appendChild(c);const u=this.createButton("⟲ Reset",()=>this.reset());o.appendChild(u),this.container.appendChild(o);const h=document.createElement("div");h.style.cssText="margin-bottom: 10px;";const f=document.createElement("div");f.style.cssText="margin-bottom: 8px; font-size: 13px; color: #ccc;",f.textContent="Playback Speed:",h.appendChild(f);const y=document.createElement("div");y.style.cssText="display: flex; gap: 8px; justify-content: center;",["0.5x","1x","2x","5x","10x"].forEach(_=>{const C=this.createButton(_,()=>this.setSpeed(parseFloat(_)));C.style.flex="1",C.style.fontSize="12px",_==="1x"&&(C.style.background="linear-gradient(135deg, #667eea, #764ba2)"),y.appendChild(C)}),h.appendChild(y),this.container.appendChild(h),this.infoDisplay=document.createElement("div"),this.infoDisplay.style.cssText=`
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid rgba(255, 255, 255, 0.2);
            font-size: 12px;
            line-height: 1.6;
            color: #ddd;
        `,this.container.appendChild(this.infoDisplay),document.body.appendChild(this.container),this.updateDisplay(0),this.isPlaying=!1,this.playbackSpeed=1}createButton(t,e){const i=document.createElement("button");return i.textContent=t,i.style.cssText=`
            padding: 8px 16px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 13px;
            font-weight: bold;
            transition: all 0.3s;
        `,i.addEventListener("mouseover",()=>{i.style.transform="scale(1.05)",i.style.boxShadow="0 4px 12px rgba(102, 126, 234, 0.4)"}),i.addEventListener("mouseout",()=>{i.style.transform="scale(1)",i.style.boxShadow="none"}),i.addEventListener("click",e),i}updateDisplay(t){const e=this.buoyDataLoader.getRecordByIndex(t);e&&(this.timeDisplay.textContent=this.formatDateTime(e.timestamp),this.slider.value=String(t),this.infoDisplay.innerHTML=`
            <div><strong>Record:</strong> ${t+1} / ${this.buoyDataLoader.getTotalRecords()}</div>
            <div><strong>Progress:</strong> ${(t/this.buoyDataLoader.getTotalRecords()*100).toFixed(1)}%</div>
        `)}togglePlayback(){this.isPlaying=!this.isPlaying,this.playButton.textContent=this.isPlaying?"⏸ Pause":"▶ Play",window.simulator&&window.simulator.params&&(window.simulator.params.isPlaying=this.isPlaying)}stepForward(){const t=parseInt(this.slider.value),e=Math.min(t+1,this.buoyDataLoader.getTotalRecords()-1);this.slider.value=String(e),this.onTimeChange(e),this.updateDisplay(e)}stepBackward(){const t=parseInt(this.slider.value),e=Math.max(t-1,0);this.slider.value=String(e),this.onTimeChange(e),this.updateDisplay(e)}reset(){this.slider.value="0",this.onTimeChange(0),this.updateDisplay(0),this.isPlaying&&this.togglePlayback()}setSpeed(t){this.playbackSpeed=t,this.container.querySelectorAll("button").forEach(i=>{i.textContent===`${t}x`?i.style.background="linear-gradient(135deg, #667eea, #764ba2)":i.textContent.includes("x")&&!i.textContent.includes("Play")&&!i.textContent.includes("Pause")&&(i.style.background="linear-gradient(135deg, #4fc3f7, #3a7bd5)")}),window.simulator&&window.simulator.params&&(window.simulator.params.playbackSpeed=t)}formatDate(t){return t?t.toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}):"N/A"}formatDateTime(t){return t?t.toLocaleString("en-US",{month:"short",day:"numeric",year:"numeric",hour:"2-digit",minute:"2-digit"}):"N/A"}destroy(){this.container&&this.container.parentNode&&this.container.parentNode.removeChild(this.container)}}class ei{constructor(){this.createPanel()}createPanel(){this.panel=document.createElement("div"),this.panel.id="data-panel",this.panel.style.cssText=`
            position: absolute;
            bottom: 20px;
            left: 20px;
            background: rgba(0, 0, 0, 0.75);
            color: white;
            padding: 20px;
            border-radius: 10px;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            font-size: 14px;
            min-width: 300px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(79, 195, 247, 0.3);
            z-index: 100;
        `;const t=document.createElement("h3");t.textContent="Current Status",t.style.cssText=`
            margin: 0 0 15px 0;
            color: #4fc3f7;
            font-size: 18px;
            border-bottom: 2px solid #4fc3f7;
            padding-bottom: 8px;
        `,this.panel.appendChild(t),this.dataContainer=document.createElement("div"),this.panel.appendChild(this.dataContainer),this.chartContainer=document.createElement("div"),this.chartContainer.style.cssText=`
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid rgba(255, 255, 255, 0.2);
        `,this.panel.appendChild(this.chartContainer),document.body.appendChild(this.panel)}update(t,e,i){const s=this.calculateInfluences(t);let o=`
            <div style="margin-bottom: 10px;">
                <strong>Parameters:</strong>
            </div>
            <div style="margin-left: 10px; line-height: 1.8;">
                <div>River: <span style="color: #81c784;">${t.riverDischarge.toFixed(0)} m³/s</span></div>
                <div>Wind: <span style="color: #64b5f6;">${t.windSpeed.toFixed(1)} m/s @ ${t.windDirection.toFixed(0)}°</span></div>
                <div>Tide: <span style="color: #ffb74d;">${t.tidePhase.toFixed(1)} hrs</span></div>
            </div>
            <div style="margin-top: 15px; margin-bottom: 10px;">
                <strong>Flow Metrics:</strong>
            </div>
            <div style="margin-left: 10px; line-height: 1.8;">
                <div>Max Velocity: <span style="color: #f06292;">${e.toFixed(2)} m/s</span></div>
                <div>Dominant Force: <span style="color: #ffd54f; font-weight: bold;">${i}</span></div>
            </div>
        `;this.dataContainer.innerHTML=o,this.updateChart(s)}calculateInfluences(t){const e=Math.min(t.riverDischarge/1e4,1),i=Math.min(t.windSpeed/30,1),s=Math.abs(Math.sin(t.tidePhase/12.4*2*Math.PI)),o=e+i+s;return{river:o>0?e/o*100:0,wind:o>0?i/o*100:0,tide:o>0?s/o*100:0}}updateChart(t){const e=`
            <div style="margin-bottom: 8px; font-weight: bold; font-size: 13px;">
                Forcing Influence:
            </div>
            <div style="margin-bottom: 8px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
                    <span>River</span>
                    <span style="color: #81c784;">${t.river.toFixed(1)}%</span>
                </div>
                <div style="background: rgba(255,255,255,0.1); border-radius: 10px; height: 18px; overflow: hidden;">
                    <div style="background: linear-gradient(90deg, #66bb6a, #81c784); height: 100%; width: ${t.river}%; transition: width 0.3s;"></div>
                </div>
            </div>
            <div style="margin-bottom: 8px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
                    <span>Wind</span>
                    <span style="color: #64b5f6;">${t.wind.toFixed(1)}%</span>
                </div>
                <div style="background: rgba(255,255,255,0.1); border-radius: 10px; height: 18px; overflow: hidden;">
                    <div style="background: linear-gradient(90deg, #42a5f5, #64b5f6); height: 100%; width: ${t.wind}%; transition: width 0.3s;"></div>
                </div>
            </div>
            <div style="margin-bottom: 8px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
                    <span>Tides</span>
                    <span style="color: #ffb74d;">${t.tide.toFixed(1)}%</span>
                </div>
                <div style="background: rgba(255,255,255,0.1); border-radius: 10px; height: 18px; overflow: hidden;">
                    <div style="background: linear-gradient(90deg, #ffa726, #ffb74d); height: 100%; width: ${t.tide}%; transition: width 0.3s;"></div>
                </div>
            </div>
        `;this.chartContainer.innerHTML=e}setVisible(t){this.panel.style.display=t?"block":"none"}updateRealData(t,e,i){let s=`
            <div style="margin-bottom: 10px;">
                <strong>Real-Time Measurements:</strong>
            </div>
            <div style="margin-left: 10px; line-height: 1.8;">
                <div>Time: <span style="color: #81c784;">${new Date(t.time).toLocaleString()}</span></div>
                <div>River Discharge: <span style="color: #64b5f6;">${t.riverDischarge?t.riverDischarge.toFixed(1):"N/A"} m³/s</span></div>
                <div>Sea Level: <span style="color: #ffb74d;">${t.seaLevel!==null&&t.seaLevel!==void 0?t.seaLevel.toFixed(2):"N/A"} m</span></div>
                <div>Air Temp: <span style="color: #f06292;">${t.airTemp!==null&&t.airTemp!==void 0?t.airTemp.toFixed(1):"N/A"} °C</span></div>
            </div>
            <div style="margin-top: 15px; margin-bottom: 10px;">
                <strong>Flow Metrics:</strong>
            </div>
            <div style="margin-left: 10px; line-height: 1.8;">
                <div>Max Velocity: <span style="color: #f06292;">${e.toFixed(2)} m/s</span></div>
                <div>Ocean Regime: <span style="color: #ffd54f; font-weight: bold;">${i}</span></div>
                <div>Cluster ID: <span style="color: #ba68c8;">${t.cluster}</span></div>
            </div>
        `;s+=`
            <div style="margin-top: 15px; margin-bottom: 10px;">
                <strong>Buoy Stations:</strong>
            </div>
            <div style="margin-left: 10px; line-height: 1.8; font-size: 12px;">
        `,Object.entries(t.buoys).forEach(([o,r])=>{if(r.u!==null&&r.u!==void 0&&r.v!==null&&r.v!==void 0){const c=Math.sqrt(r.u*r.u+r.v*r.v);s+=`<div>${o}: <span style="color: #4fc3f7;">${c.toFixed(2)} m/s</span></div>`}else s+=`<div>${o}: <span style="color: #999;">No data</span></div>`}),s+="</div>",this.dataContainer.innerHTML=s}destroy(){this.panel&&this.panel.parentNode&&this.panel.parentNode.removeChild(this.panel)}}class ii{constructor(){this.createPanel(),this.isVisible=!0}createPanel(){this.overlay=document.createElement("div"),this.overlay.style.cssText=`
            position: absolute;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.85);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            backdrop-filter: blur(5px);
        `,this.panel=document.createElement("div"),this.panel.style.cssText=`
            background: linear-gradient(135deg, #1a2332 0%, #0a0e27 100%);
            color: white;
            padding: 40px;
            border-radius: 15px;
            max-width: 600px;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            border: 2px solid #4fc3f7;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
        `,this.panel.innerHTML=`
            <h2 style="color: #4fc3f7; margin: 0 0 20px 0; font-size: 28px;">
                Welcome to Ocean Current Simulator
            </h2>
            <p style="line-height: 1.6; margin-bottom: 20px; color: #b0bec5;">
                This interactive 3D visualization demonstrates how different forcing mechanisms
                affect surface currents in the Strait of Georgia, British Columbia.
            </p>

            <h3 style="color: #81c784; margin: 20px 0 10px 0; font-size: 20px;">
                Controls
            </h3>
            <ul style="line-height: 2; color: #e0e0e0; margin-left: 20px;">
                <li><strong>Mouse Drag:</strong> Rotate view</li>
                <li><strong>Mouse Wheel:</strong> Zoom in/out</li>
                <li><strong>Right Panel:</strong> Adjust forcing parameters</li>
            </ul>

            <h3 style="color: #64b5f6; margin: 20px 0 10px 0; font-size: 20px;">
                Forcing Mechanisms
            </h3>
            <ul style="line-height: 2; color: #e0e0e0; margin-left: 20px;">
                <li><strong style="color: #81c784;">River Discharge:</strong> Fraser River outflow creates a northward plume</li>
                <li><strong style="color: #64b5f6;">Wind:</strong> Surface wind stress drives current with Ekman deflection</li>
                <li><strong style="color: #ffb74d;">Tides:</strong> Periodic along-strait oscillations (~12.4 hour cycle)</li>
            </ul>

            <h3 style="color: #ffd54f; margin: 20px 0 10px 0; font-size: 20px;">
                Visualization
            </h3>
            <ul style="line-height: 2; color: #e0e0e0; margin-left: 20px;">
                <li><strong>Particles:</strong> Colored by speed (blue=slow, red=fast)</li>
                <li><strong>Vectors:</strong> Show direction and magnitude at grid points</li>
                <li><strong>Bottom Left Panel:</strong> Real-time metrics and forcing influence</li>
            </ul>

            <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.2); color: #90a4ae; font-size: 14px;">
                This simulator uses physics-based mock data to demonstrate the research framework
                developed for understanding ocean current dynamics in the Strait of Georgia.
            </p>

            <button id="start-btn" style="
                margin-top: 20px;
                padding: 15px 40px;
                background: linear-gradient(135deg, #4fc3f7, #2196f3);
                color: white;
                border: none;
                border-radius: 8px;
                font-size: 18px;
                font-weight: bold;
                cursor: pointer;
                width: 100%;
                transition: transform 0.2s, box-shadow 0.2s;
            ">
                Start Exploring
            </button>
        `,this.overlay.appendChild(this.panel),document.body.appendChild(this.overlay);const t=document.getElementById("start-btn");t.addEventListener("mouseenter",()=>{t.style.transform="translateY(-2px)",t.style.boxShadow="0 5px 20px rgba(79, 195, 247, 0.4)"}),t.addEventListener("mouseleave",()=>{t.style.transform="translateY(0)",t.style.boxShadow="none"}),t.addEventListener("click",()=>this.hide())}hide(){this.overlay.style.display="none",this.isVisible=!1}show(){this.overlay.style.display="flex",this.isVisible=!0}destroy(){this.overlay&&this.overlay.parentNode&&this.overlay.parentNode.removeChild(this.overlay)}}class si{constructor(){console.log("Initializing Ocean Current Simulator..."),this.init(),this.loadData()}async loadData(){console.log("Loading buoy data..."),this.buoyDataLoader=new ze,this.fieldInterpolator=new Ve;try{await this.buoyDataLoader.loadCSV("/Ocean-current-simulator/processed_buoy_data_clustered_k3.csv"),console.log("Buoy data loaded successfully!"),console.log("Total records:",this.buoyDataLoader.getTotalRecords()),this.currentRecordIndex=0,this.currentRecord=this.buoyDataLoader.getRecordByIndex(0),console.log("Controls setup..."),this.setupControls(),console.log("Scene setup..."),this.setupScene(),console.log("Starting animation..."),this.animate(),console.log("Hiding loading screen..."),this.hideLoading(),console.log("Simulator ready!")}catch(t){console.error("Failed to load buoy data:",t),alert("Failed to load ocean current data. Please check console for details.")}}init(){this.scene=new de,this.scene.background=new qt(658983),this.scene.fog=new ce(658983,50,200),this.camera=new ue(60,window.innerWidth/window.innerHeight,.1,1e3),this.camera.position.set(0,50,80),this.camera.lookAt(0,0,0),this.renderer=new pe({antialias:!0}),this.renderer.setSize(window.innerWidth,window.innerHeight),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),document.getElementById("canvas-container").appendChild(this.renderer.domElement),this.controls=new _e(this.camera,this.renderer.domElement),this.controls.enableDamping=!0,this.controls.dampingFactor=.05,this.controls.maxPolarAngle=Math.PI/2.2,this.controls.minDistance=30,this.controls.maxDistance=150,this.params={showVectors:!0,showParticles:!0,particleCount:5e3,playbackSpeed:1,isPlaying:!1,currentIndex:0},this.time=0,this.clock=new me,this.accumulatedTime=0,window.addEventListener("resize",()=>this.onWindowResize())}setupScene(){const t=new fe(16777215,.6);this.scene.add(t);const e=new ge(16777215,.8);e.position.set(50,100,50),e.castShadow=!0,this.scene.add(e),this.oceanScene=new Le,this.scene.add(this.oceanScene.group),this.particleSystem=new Pe(this.params.particleCount),this.scene.add(this.particleSystem.points),this.vectorField=new Re,this.scene.add(this.vectorField.group),this.updateCurrents()}setupControls(){this.controlPanel=new Je(this.params,()=>this.updateCurrents()),this.timelineControl=new ti(this.buoyDataLoader,t=>this.setRecordByIndex(t)),this.dataPanel=new ei,this.helpPanel=new ii,window.simulator=this}updateCurrents(){if(!this.currentRecord)return;const t=this.fieldInterpolator.interpolateToField(this.currentRecord.spatialGrid,this.currentRecord.buoys);this.currentVelocityField=t,this.particleSystem.setVelocityField(t),this.params.showVectors?(this.vectorField.update(t),this.vectorField.group.visible=!0):this.vectorField.group.visible=!1,this.particleSystem.points.visible=this.params.showParticles;const e=this.fieldInterpolator.getMaxVelocity(t),i=this.buoyDataLoader.getClusterName(this.currentRecord.cluster);this.dataPanel.updateRealData(this.currentRecord,e,i)}setRecordByIndex(t){const e=this.buoyDataLoader.getRecordByIndex(t);e&&(this.currentRecordIndex=t,this.currentRecord=e,this.params.currentIndex=t,this.updateCurrents())}animate(){requestAnimationFrame(()=>this.animate());const t=this.clock.getDelta();if(this.params.isPlaying&&this.buoyDataLoader&&(this.accumulatedTime+=t*this.params.playbackSpeed,this.accumulatedTime>=1)){this.accumulatedTime=0;const e=(this.currentRecordIndex+1)%this.buoyDataLoader.getTotalRecords();this.setRecordByIndex(e)}this.time+=t,this.controls.update(),this.currentVelocityField&&this.particleSystem.update(t),this.oceanScene.update(this.time),this.renderer.render(this.scene,this.camera)}onWindowResize(){this.camera.aspect=window.innerWidth/window.innerHeight,this.camera.updateProjectionMatrix(),this.renderer.setSize(window.innerWidth,window.innerHeight)}hideLoading(){const t=document.getElementById("loading");t&&t.classList.add("hidden")}}new si;
//# sourceMappingURL=index-8okCnR61.js.map
