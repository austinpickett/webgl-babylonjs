var __extends=this&&this.__extends||(function(){var i=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(i,t){i.__proto__=t}||function(i,t){for(var e in t)t.hasOwnProperty(e)&&(i[e]=t[e])};return function(t,e){function n(){this.constructor=t}i(t,e),t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)}})(),__decorate=this&&this.__decorate||function(i,t,e,n){var o,r=arguments.length,a=r<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,e):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(i,t,e,n);else for(var l=i.length-1;l>=0;l--)(o=i[l])&&(a=(r<3?o(a):r>3?o(t,e,a):o(t,e))||a);return r>3&&a&&Object.defineProperty(t,e,a),a},BABYLON;!(function(i){var t=(function(i){function t(){var t=i.call(this)||this;return t.TRANSPARENT=!1,t.FOG=!1,t.PREMULTIPLYALPHA=!1,t.rebuild(),t}return __extends(t,i),t})(i.MaterialDefines),e=(function(e){function n(t,n){var o=e.call(this,t,n)||this;return o.mainColor=i.Color3.Black(),o.lineColor=i.Color3.Teal(),o.gridRatio=1,o.gridOffset=i.Vector3.Zero(),o.majorUnitFrequency=10,o.minorUnitVisibility=.33,o.opacity=1,o.preMultiplyAlpha=!1,o._gridControl=new i.Vector4(o.gridRatio,o.majorUnitFrequency,o.minorUnitVisibility,o.opacity),o}return __extends(n,e),n.prototype.needAlphaBlending=function(){return this.opacity<1},n.prototype.needAlphaBlendingForMesh=function(i){return this.needAlphaBlending()},n.prototype.isReadyForSubMesh=function(e,n,o){if(this.isFrozen&&this._wasPreviouslyReady&&n.effect)return!0;n._materialDefines||(n._materialDefines=new t);var r=n._materialDefines,a=this.getScene();if(!this.checkReadyOnEveryCall&&n.effect&&this._renderId===a.getRenderId())return!0;if(r.TRANSPARENT!==this.opacity<1&&(r.TRANSPARENT=!r.TRANSPARENT,r.markAsUnprocessed()),r.PREMULTIPLYALPHA!=this.preMultiplyAlpha&&(r.PREMULTIPLYALPHA=!r.PREMULTIPLYALPHA,r.markAsUnprocessed()),i.MaterialHelper.PrepareDefinesForMisc(e,a,!1,!1,this.fogEnabled,!1,r),r.isDirty){r.markAsProcessed(),a.resetCachedMaterial();var l=[i.VertexBuffer.PositionKind,i.VertexBuffer.NormalKind],s=r.toString();n.setEffect(a.getEngine().createEffect("grid",l,["projection","worldView","mainColor","lineColor","gridControl","gridOffset","vFogInfos","vFogColor","world","view"],[],s,void 0,this.onCompiled,this.onError),r)}return!(!n.effect||!n.effect.isReady())&&(this._renderId=a.getRenderId(),this._wasPreviouslyReady=!0,!0)},n.prototype.bindForSubMesh=function(t,e,n){var o=this.getScene();if(n._materialDefines){var r=n.effect;r&&(this._activeEffect=r,this.bindOnlyWorldMatrix(t),this._activeEffect.setMatrix("worldView",t.multiply(o.getViewMatrix())),this._activeEffect.setMatrix("view",o.getViewMatrix()),this._activeEffect.setMatrix("projection",o.getProjectionMatrix()),this._mustRebind(o,r)&&(this._activeEffect.setColor3("mainColor",this.mainColor),this._activeEffect.setColor3("lineColor",this.lineColor),this._activeEffect.setVector3("gridOffset",this.gridOffset),this._gridControl.x=this.gridRatio,this._gridControl.y=Math.round(this.majorUnitFrequency),this._gridControl.z=this.minorUnitVisibility,this._gridControl.w=this.opacity,this._activeEffect.setVector4("gridControl",this._gridControl)),i.MaterialHelper.BindFogParameters(o,e,this._activeEffect),this._afterBind(e,this._activeEffect))}},n.prototype.dispose=function(i){e.prototype.dispose.call(this,i)},n.prototype.clone=function(t){var e=this;return i.SerializationHelper.Clone((function(){return new n(t,e.getScene())}),this)},n.prototype.serialize=function(){var t=i.SerializationHelper.Serialize(this);return t.customType="BABYLON.GridMaterial",t},n.prototype.getClassName=function(){return"GridMaterial"},n.Parse=function(t,e,o){return i.SerializationHelper.Parse((function(){return new n(t.name,e)}),t,e,o)},__decorate([i.serializeAsColor3()],n.prototype,"mainColor",void 0),__decorate([i.serializeAsColor3()],n.prototype,"lineColor",void 0),__decorate([i.serialize()],n.prototype,"gridRatio",void 0),__decorate([i.serializeAsColor3()],n.prototype,"gridOffset",void 0),__decorate([i.serialize()],n.prototype,"majorUnitFrequency",void 0),__decorate([i.serialize()],n.prototype,"minorUnitVisibility",void 0),__decorate([i.serialize()],n.prototype,"opacity",void 0),__decorate([i.serialize()],n.prototype,"preMultiplyAlpha",void 0),n})(i.PushMaterial);i.GridMaterial=e})(BABYLON||(BABYLON={})),BABYLON.Effect.ShadersStore.gridVertexShader="precision highp float;\n\nattribute vec3 position;\nattribute vec3 normal;\n\nuniform mat4 projection;\nuniform mat4 world;\nuniform mat4 view;\nuniform mat4 worldView;\n\n#ifdef TRANSPARENT\nvarying vec4 vCameraSpacePosition;\n#endif\nvarying vec3 vPosition;\nvarying vec3 vNormal;\n#include<fogVertexDeclaration>\nvoid main(void) {\n#ifdef FOG\nvec4 worldPos=world*vec4(position,1.0);\n#endif\n#include<fogVertex>\nvec4 cameraSpacePosition=worldView*vec4(position,1.0);\ngl_Position=projection*cameraSpacePosition;\n#ifdef TRANSPARENT\nvCameraSpacePosition=cameraSpacePosition;\n#endif\nvPosition=position;\nvNormal=normal;\n}",BABYLON.Effect.ShadersStore.gridPixelShader="#extension GL_OES_standard_derivatives : enable\n#define SQRT2 1.41421356\n#define PI 3.14159\nprecision highp float;\nuniform vec3 mainColor;\nuniform vec3 lineColor;\nuniform vec4 gridControl;\nuniform vec3 gridOffset;\n\n#ifdef TRANSPARENT\nvarying vec4 vCameraSpacePosition;\n#endif\nvarying vec3 vPosition;\nvarying vec3 vNormal;\n#include<fogFragmentDeclaration>\nfloat getVisibility(float position) {\n\nfloat majorGridFrequency=gridControl.y;\nif (floor(position+0.5) == floor(position/majorGridFrequency+0.5)*majorGridFrequency)\n{\nreturn 1.0;\n} \nreturn gridControl.z;\n}\nfloat getAnisotropicAttenuation(float differentialLength) {\nconst float maxNumberOfLines=10.0;\nreturn clamp(1.0/(differentialLength+1.0)-1.0/maxNumberOfLines,0.0,1.0);\n}\nfloat isPointOnLine(float position,float differentialLength) {\nfloat fractionPartOfPosition=position-floor(position+0.5); \nfractionPartOfPosition/=differentialLength; \nfractionPartOfPosition=clamp(fractionPartOfPosition,-1.,1.);\nfloat result=0.5+0.5*cos(fractionPartOfPosition*PI); \nreturn result; \n}\nfloat contributionOnAxis(float position) {\nfloat differentialLength=length(vec2(dFdx(position),dFdy(position)));\ndifferentialLength*=SQRT2; \n\nfloat result=isPointOnLine(position,differentialLength);\n\nfloat visibility=getVisibility(position);\nresult*=visibility;\n\nfloat anisotropicAttenuation=getAnisotropicAttenuation(differentialLength);\nresult*=anisotropicAttenuation;\nreturn result;\n}\nfloat normalImpactOnAxis(float x) {\nfloat normalImpact=clamp(1.0-3.0*abs(x*x*x),0.0,1.0);\nreturn normalImpact;\n}\nvoid main(void) {\n\nfloat gridRatio=gridControl.x;\nvec3 gridPos=(vPosition+gridOffset)/gridRatio;\n\nfloat x=contributionOnAxis(gridPos.x);\nfloat y=contributionOnAxis(gridPos.y);\nfloat z=contributionOnAxis(gridPos.z);\n\nvec3 normal=normalize(vNormal);\nx*=normalImpactOnAxis(normal.x);\ny*=normalImpactOnAxis(normal.y);\nz*=normalImpactOnAxis(normal.z);\n\nfloat grid=clamp(x+y+z,0.,1.);\n\nvec3 color=mix(mainColor,lineColor,grid);\n#ifdef FOG\n#include<fogFragment>\n#endif\n#ifdef TRANSPARENT\nfloat distanceToFragment=length(vCameraSpacePosition.xyz);\nfloat cameraPassThrough=clamp(distanceToFragment-0.25,0.0,1.0);\nfloat opacity=clamp(grid,0.08,cameraPassThrough*gridControl.w*grid);\ngl_FragColor=vec4(color.rgb,opacity);\n#ifdef PREMULTIPLYALPHA\ngl_FragColor.rgb*=opacity;\n#endif\n#else\n\ngl_FragColor=vec4(color.rgb,1.0);\n#endif\n}";