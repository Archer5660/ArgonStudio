window.SparkSceneConfig={"family":0,"colorMode":"light","themePreference":"auto","seed":36,"center":[0.3973945155796644,0.28759472105279454],"curve":[0.7351230283827099,0.7057893712440644],"spread":68,"softness":62,"beamIntensity":64,"showFour":true,"motifType":"four","symbolName":"shield","symbolFill":false,"symbolWeight":600,"symbolRound":100,"fourSize":121,"fourPosX":0,"fourPosY":0,"fourOpacity":84,"idleEvap":46,"fourEvap":42,"sparkShapeType":"text","sparkSymbol":"spark","sparkSymbolFill":true,"sparkText":"4","density":17,"sparkScale":84,"sparkSizeFalloff":22,"sparkOpacityDark":53,"sparkOpacityLight":35,"prominence":78,"meshDepth":48,"sparkPosX":0,"sparkPosY":10,"secondMesh":true,"spark2ShapeType":"text","spark2Symbol":"spark","spark2SymbolFill":true,"spark2Text":"4","density2":66,"spark2Scale":141,"spark2SizeFalloff":34,"spark2OpacityDark":38,"spark2OpacityLight":69,"meshDepth2":72,"spark2PosX":17,"spark2PosY":-22,"grain":35,"energy":75,"duration":15,"seamlessLoop":true,"parallax":true,"ripple":true,"hoverReactivity":30,"hoverSize":100,"repulsion":20,"reach":100,"ratio":"16:9","aspectRatio":"16:9","themeBehavior":"auto","posterTime":4.90441400000002,"glyph":"data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22256%22%20height%3D%22256%22%20viewBox%3D%2270.0%20-890.0%20820.0%20820.0%22%3E%3Cpath%20transform%3D%22scale(1%2C-1)%22%20fill%3D%22white%22%20d%3D%22M480%2080Q474%2080%20469.0%2084.0Q464%2088%20462%2094Q445%20161%20411.0%20220.0Q377%20279%20328%20328Q279%20377%20220.0%20411.0Q161%20445%2094%20462Q88%20464%2084.0%20469.0Q80%20474%2080.0%20480.0Q80%20486%2084.0%20491.0Q88%20496%2094%20498Q161%20515%20220.0%20549.0Q279%20583%20328%20632Q377%20681%20411.0%20740.0Q445%20799%20462%20866Q464%20872%20469.0%20876.0Q474%20880%20480.0%20880.0Q486%20880%20490.5%20876.0Q495%20872%20497%20866Q515%20799%20549.0%20740.0Q583%20681%20632.0%20632.0Q681%20583%20740.0%20549.0Q799%20515%20866%20498Q872%20496%20876.0%20491.0Q880%20486%20880.0%20480.0Q880%20474%20876.0%20469.0Q872%20464%20866%20462Q799%20445%20740.0%20411.0Q681%20377%20632%20328Q583%20279%20549.0%20220.0Q515%20161%20498%2094Q496%2088%20491.0%2084.0Q486%2080%20480%2080Z%22%2F%3E%3C%2Fsvg%3E","noise":"procedural"};(function(global){'use strict';const defaults={family:0,colorMode:'dark',themePreference:'auto',seed:12,center:[0.5,0.26],curve:[0.75,0.68],spread:80,softness:80,beamIntensity:20,showFour:false,motifType:'four',symbolName:'shield',symbolFill:false,symbolWeight:600,symbolRound:100,fourSize:120,fourPosX:0,fourPosY:0,fourOpacity:30,idleEvap:100,fourEvap:75,sparkShapeType:'text',sparkSymbol:'spark',sparkSymbolFill:true,sparkText:'4',density:20,sparkScale:143,sparkSizeFalloff:47,sparkOpacityDark:60,sparkOpacityLight:35,prominence:70,meshDepth:41,sparkPosX:18,sparkPosY:33,secondMesh:true,spark2ShapeType:'text',spark2Symbol:'spark',spark2SymbolFill:true,spark2Text:'4',density2:14,spark2Scale:129,spark2SizeFalloff:51,spark2OpacityDark:73,spark2OpacityLight:35,meshDepth2:80,spark2PosX:-50,spark2PosY:-43,grain:35,energy:75,duration:15,seamlessLoop:true,parallax:true,ripple:true,hoverReactivity:30,hoverSize:100,repulsion:20,reach:100};const anchors=[[[0.5,0.26],[0.75,0.68]],[[0.29,0.18],[0.69,0.61]],[[0.38,0.28],[0.78,0.49]]];const framing={scale(width,height){const relative=(width/height)/(16/9);return relative<1?[relative,1]:[1,1/relative];},toScene(point,width,height){const scale=this.scale(width,height);return point.map((v,i)=>(v-0.5)*scale[i]+0.5);},toScreen(point,width,height){const scale=this.scale(width,height);return point.map((v,i)=>(v-0.5)/scale[i]+0.5);}};const vertex=`attribute vec2 position;
varying vec2 uv;
void main(){
uv=position*0.5+0.5;
gl_Position=vec4(position,0.0,1.0);
}`;const fragment=`precision highp float;
varying vec2 uv;
uniform vec2 resolution,viewScale,shift,pointer,tap,focusPoint;
uniform float darkMode,neutralMode,family,zoom,rotation,softness,beamIntensity,showFour,motifMode,fourSize,fourPosX,fourPosY,fourOpacity,idleEvap,fourEvap,grain,energy,phase,tapAge,seed,focusAmount,renderPass;
uniform sampler2D noiseMap;
uniform sampler2D motifSdfMap;
float bell(vec2 p,vec2 c,vec2 r){
vec2 q=(p-c)/r;
return exp(-dot(q,q)*2.0);
}
float rotBell(vec2 p,vec2 c,vec2 r,float ang){
vec2 d=p-c;
float ca=cos(ang),sa=sin(ang);
vec2 q=vec2(ca*d.x+sa*d.y,-sa*d.x+ca*d.y)/r;
return exp(-dot(q,q)*2.0);
}
void blendOver(inout vec3 baseC,inout float baseA,vec3 srcC,float srcA){
float a=clamp(srcA,0.0,1.0);
float outA=a+baseA*(1.0-a);
baseC=(srcC*a+baseC*baseA*(1.0-a))/max(outA,0.0001);
baseA=outA;
}
float sdRect(vec2 p,vec2 a,vec2 b){
vec2 d=abs(p-(a+b)*0.5)-(b-a)*0.5;
return length(max(d,0.0))+min(max(d.x,d.y),0.0);
}
float sdFour(vec2 p){
vec2 g=vec2((p.x-0.54)*1.7778,p.y-0.50);
float stem=sdRect(g,vec2(0.052,-0.335),vec2(0.156,0.335));
float bar=sdRect(g,vec2(-0.245,0.084),vec2(0.240,0.174));
float leftKnee=sdRect(g,vec2(-0.245,0.058),vec2(-0.122,0.174));
float dOuter=dot(g-vec2(-0.245,0.058),vec2(-0.8185,-0.5745));
float dInner=dot(g-vec2(-0.122,0.084),vec2(0.8348,0.5506));
float dSlab=max(dOuter,dInner);
float dBounds=max(max(-0.335-g.y,g.y-0.128),max(-0.245-g.x,g.x-0.095));
float diag=length(max(vec2(dSlab,dBounds),0.0))+min(max(dSlab,dBounds),0.0);
return min(min(stem,bar),min(diag,max(leftKnee,dOuter)));
}
float unpackSdf(vec2 tc){
vec4 c=texture2D(motifSdfMap,clamp(tc,0.001,0.999));
return ((c.r*255.0*256.0+c.g*255.0)/65535.0-0.5)*0.48;
}
float sdSymbol(vec2 p){
vec2 g=vec2((p.x-0.54)*1.7778,p.y-0.50);
vec2 tc=g/0.96+0.5;
vec2 boxD=abs(tc-0.5)-0.494;
float outsideBox=length(max(boxD,0.0))*0.96;
if(outsideBox>0.015){
return 0.24+outsideBox;
}
vec2 pix=tc*512.0-0.5;
vec2 i=floor(pix);
vec2 f=fract(pix);
vec2 i00=(i+vec2(0.5,0.5))/512.0;
vec2 i10=(i+vec2(1.5,0.5))/512.0;
vec2 i01=(i+vec2(0.5,1.5))/512.0;
vec2 i11=(i+vec2(1.5,1.5))/512.0;
float d=mix(
mix(unpackSdf(i00),unpackSdf(i10),f.x),
mix(unpackSdf(i01),unpackSdf(i11),f.x),
f.y
);
return d+outsideBox;
}
float sdMotif(vec2 p){
if(motifMode>0.5){
return sdSymbol(p);
}
return sdFour(p);
}
vec2 hash22(vec2 p){
vec3 p3=fract(vec3(p.xyx)*vec3(0.1031,0.1030,0.0973));
p3+=dot(p3,p3.yzx+33.33);
return fract((p3.xx+p3.yz)*p3.zy)*2.0-1.0;
}
float gnoise(vec2 p){
vec2 i=floor(p);
vec2 f=fract(p);
vec2 u=f*f*f*(f*(f*6.0-15.0)+10.0);
return mix(
mix(dot(hash22(i+vec2(0.0,0.0)),f-vec2(0.0,0.0)),
dot(hash22(i+vec2(1.0,0.0)),f-vec2(1.0,0.0)),u.x),
mix(dot(hash22(i+vec2(0.0,1.0)),f-vec2(0.0,1.0)),
dot(hash22(i+vec2(1.0,1.0)),f-vec2(1.0,1.0)),u.x),
u.y
)*0.5+0.5;
}
float fbm(vec2 p){
float v=0.0;
float amp=0.5;
mat2 rot=mat2(0.80,-0.60,0.60,0.80);
for(int i=0;i<3;i++){
v+=amp*gnoise(p);
p=rot*p*2.03+vec2(13.7,29.3);
amp*=0.5;
}
return v*1.0714286;
}
void main(){
vec2 screen=vec2(uv.x,1.0-uv.y);
vec2 scene=(screen-0.5)*viewScale+0.5;
float a=phase*6.2831853;
float soft=mix(0.76,1.34,clamp((softness-15.0)/65.0,0.0,1.0));
float beamGain=mix(0.62,1.04,clamp((beamIntensity-20.0)/80.0,0.0,1.0));
float ign1=fract(52.9829189*fract(dot(gl_FragCoord.xy,vec2(0.06711056,0.00583715))));
float ign2=fract(52.9829189*fract(dot(gl_FragCoord.xy+vec2(17.3,31.7),vec2(0.06711056,0.00583715))));
vec3 dither=vec3(ign1-ign2,(ign2-0.5)+(ign1-0.5),fract(ign1+0.37)-fract(ign2+0.73))*(1.35/255.0);
vec2 p=scene;
if(tapAge<4.0){
p+=normalize(p-tap+vec2(0.00001))*sin(length(p-tap)*35.0-tapAge*7.0)*exp(-tapAge*2.4)*0.0028;
}
p-=shift*0.55;
p+=pointer*0.018;
float motionAmp=energy*0.00032;
vec2 flowOffset=vec2(sin(a)*1.15+0.35*cos(a*2.0),cos(a)*0.95-0.30*sin(a*2.0))*motionAmp;
p+=flowOffset;
mat2 R=mat2(cos(rotation),-sin(rotation),sin(rotation),cos(rotation));
p=R*(p-0.5)/zoom+0.5;
if(renderPass<0.5){
vec2 pSky=p;
vec2 cursorShift=(focusPoint-0.5)*focusAmount*0.026;
pSky-=cursorShift;
float diagCoord=pSky.x*0.78+pSky.y*0.62;
float rayDrift=sin(a+diagCoord*2.6)*(energy*0.00045);
vec2 pWave=pSky+vec2(rayDrift,-rayDrift*0.75);
vec3 col;
if(darkMode>0.5){
float dSoft=soft/1.34;
float dBeam=mix(1.0,1.22,clamp((beamIntensity-20.0)/80.0,0.0,1.0));
vec3 topRow=mix(vec3(32.1,69.0,161.1)/255.0,vec3(129.0,217.7,252.2)/255.0,clamp(pWave.x,0.0,1.0));
vec3 botRow=mix(vec3(9.8,32.7,61.2)/255.0,vec3(0.0,32.5,135.9)/255.0,clamp(pWave.x,0.0,1.0));
col=mix(topRow,botRow,clamp(pWave.y,0.0,1.0));
col=mix(col,vec3(10.4,67.5,162.0)/255.0,clamp(rotBell(pWave,vec2(0.681,0.203),vec2(0.329,0.349)*dSoft,1.117)*0.662*dBeam,0.0,0.96));
col=mix(col,vec3(115.9,206.6,255.0)/255.0,clamp(rotBell(pWave,vec2(0.945,0.144),vec2(0.388,0.420)*dSoft,0.033)*0.712*dBeam,0.0,0.96));
col=mix(col,vec3(0.0,66.2,252.1)/255.0,clamp(rotBell(pWave,vec2(0.853,0.693),vec2(0.550,0.729)*dSoft,-0.437)*0.334*dBeam,0.0,0.96));
col=mix(col,vec3(0.0,31.9,112.0)/255.0,clamp(rotBell(pWave,vec2(0.308,0.570),vec2(0.444,0.414)*dSoft,-0.062)*0.860,0.0,0.96));
col=mix(col,vec3(0.2,0.0,6.1)/255.0,clamp(rotBell(pWave,vec2(0.210,0.825),vec2(0.393,0.619)*dSoft,-0.689)*0.790,0.0,0.96));
col=mix(col,vec3(0.0,8.2,31.5)/255.0,clamp(rotBell(pWave,vec2(0.658,0.941),vec2(0.491,0.395)*dSoft,-0.359)*0.698,0.0,0.96));
col=mix(col,vec3(83.5,208.7,255.0)/255.0,clamp(rotBell(pWave,vec2(1.173,0.898),vec2(0.242,0.808)*dSoft,0.033)*0.960*dBeam,0.0,0.96));
}else if(neutralMode>0.5){
float nSoft=soft/1.34;
float nBeam=mix(1.0,1.20,clamp((beamIntensity-20.0)/80.0,0.0,1.0));
vec3 topRow=mix(vec3(53.8,90.2,209.3)/255.0,vec3(174.3,246.4,255.0)/255.0,clamp(pWave.x,0.0,1.0));
vec3 botRow=mix(vec3(0.0,77.0,137.1)/255.0,vec3(0.0,88.6,255.0)/255.0,clamp(pWave.x,0.0,1.0));
col=mix(topRow,botRow,clamp(pWave.y,0.0,1.0));
col=mix(col,vec3(21.2,158.5,255.0)/255.0,clamp(rotBell(pWave,vec2(0.409,0.022),vec2(0.324,0.499)*nSoft,0.579)*0.960*nBeam,0.0,0.96));
col=mix(col,vec3(150.7,205.5,250.8)/255.0,clamp(rotBell(pWave,vec2(0.483,-0.023),vec2(0.451,0.233)*nSoft,-0.856)*0.960*nBeam,0.0,0.96));
col=mix(col,vec3(209.1,249.4,255.0)/255.0,clamp(rotBell(pWave,vec2(0.949,0.250),vec2(0.349,0.547)*nSoft,-0.072)*0.897*nBeam,0.0,0.96));
col=mix(col,vec3(69.8,189.2,255.0)/255.0,clamp(rotBell(pWave,vec2(0.618,0.501),vec2(0.220,0.599)*nSoft,0.103)*0.834*nBeam,0.0,0.96));
col=mix(col,vec3(0.0,52.5,165.6)/255.0,clamp(rotBell(pWave,vec2(0.321,0.639),vec2(0.409,0.318)*nSoft,0.696)*0.958,0.0,0.96));
col=mix(col,vec3(1.1,12.9,51.6)/255.0,clamp(rotBell(pWave,vec2(0.190,0.845),vec2(0.291,0.489)*nSoft,-0.377)*0.935,0.0,0.96));
col=mix(col,vec3(0.0,21.3,87.8)/255.0,clamp(rotBell(pWave,vec2(0.665,0.939),vec2(0.484,0.308)*nSoft,-0.271)*0.934,0.0,0.96));
col=mix(col,vec3(13.4,182.2,238.3)/255.0,clamp(rotBell(pWave,vec2(-0.069,1.128),vec2(0.850,0.220)*nSoft,0.175)*0.801,0.0,0.96));
col=mix(col,vec3(61.6,212.7,255.0)/255.0,clamp(rotBell(pWave,vec2(1.055,0.843),vec2(0.220,0.584)*nSoft,-0.047)*0.833*nBeam,0.0,0.96));
}else{
float lSoft=soft/1.34;
float lBeam=mix(1.0,1.18,clamp((beamIntensity-20.0)/80.0,0.0,1.0));
vec3 topRow=mix(vec3(255.0,255.0,255.0)/255.0,vec3(105.8,176.0,234.3)/255.0,clamp(pWave.x,0.0,1.0));
vec3 botRow=mix(vec3(164.4,203.8,252.2)/255.0,vec3(139.6,205.2,255.0)/255.0,clamp(pWave.x,0.0,1.0));
col=mix(topRow,botRow,clamp(pWave.y,0.0,1.0));
col=mix(col,vec3(156.2,211.4,253.5)/255.0,clamp(rotBell(pWave,vec2(0.309,0.159),vec2(0.495,0.379)*lSoft,-0.265)*0.960,0.0,0.96));
col=mix(col,vec3(89.8,185.2,255.0)/255.0,clamp(rotBell(pWave,vec2(0.816,0.291),vec2(0.395,0.282)*lSoft,0.191)*0.859,0.0,0.96));
col=mix(col,vec3(164.9,227.6,255.0)/255.0,clamp(rotBell(pWave,vec2(1.032,0.492),vec2(0.691,0.342)*lSoft,-0.514)*0.960,0.0,0.96));
col=mix(col,vec3(238.3,249.9,255.0)/255.0,clamp(rotBell(pWave,vec2(0.182,0.654),vec2(0.666,0.371)*lSoft,0.531)*0.833*lBeam,0.0,0.96));
col=mix(col,vec3(250.5,253.0,255.0)/255.0,clamp(rotBell(pWave,vec2(0.356,0.452),vec2(0.446,0.243)*lSoft,-0.444)*0.801*lBeam,0.0,0.96));
col=mix(col,vec3(227.2,243.4,254.8)/255.0,clamp(rotBell(pWave,vec2(0.783,0.816),vec2(0.534,0.231)*lSoft,-0.374)*0.878*lBeam,0.0,0.96));
col=mix(col,vec3(97.3,188.9,249.2)/255.0,clamp(rotBell(pWave,vec2(0.004,1.114),vec2(0.627,0.197)*lSoft,-0.873)*0.456,0.0,0.96));
}
float pxScale=max(1.0,max(resolution.x,resolution.y)/2560.0);
vec2 grainPx=floor(gl_FragCoord.xy/pxScale);
vec2 tileId=floor(grainPx/512.0);
vec2 noiseUV1=(grainPx+0.5)/512.0;
vec2 noiseUV2=(grainPx+floor(vec2(tileId.x*173.0+tileId.y*311.0,tileId.x*257.0-tileId.y*139.0))+0.5)/512.0;
float n1=texture2D(noiseMap,noiseUV1).r-0.5;
float n2=texture2D(noiseMap,noiseUV2).g-0.5;
float grainSignal=(n1+n2)*0.65;
float grainAmp=grain*0.0024;
float lum=dot(col,vec3(0.2126,0.7152,0.0722));
float lumShift=-0.30*smoothstep(0.92,0.995,lum)+0.30*smoothstep(0.08,0.005,lum);
col=clamp(col+vec3((grainSignal+lumShift)*grainAmp),0.0,1.0);
gl_FragColor=vec4(clamp(col+dither,0.0,1.0),1.0);
return;
}
if(showFour<0.5){
gl_FragColor=vec4(0.0);
return;
}
float s4=clamp(fourSize/100.0,0.4,2.0);
vec2 fourOffset=vec2(fourPosX,fourPosY)*0.0075;
vec2 fourCenter=vec2(0.50,0.50)+fourOffset;
vec2 c4=scene-fourCenter;
vec2 tilt4=vec2(c4.x*pointer.x*0.022+c4.y*pointer.x*0.010,c4.y*pointer.y*0.020+c4.x*pointer.y*0.008);
vec2 p4World=scene+pointer*0.028+tilt4+vec2(sin(a),cos(a)-1.0)*energy*0.00010;
vec2 p4=(p4World-fourCenter)/s4+vec2(0.54,0.50);
vec2 isoP=vec2((p4.x-0.54)*1.7778,p4.y-0.50);
if(abs(isoP.x)>0.72 || abs(isoP.y)>0.72){
gl_FragColor=vec4(0.0);
return;
}
float dExact=sdMotif(p4);
if(dExact>0.28*max(1.0,soft*0.85)){
gl_FragColor=vec4(0.0);
return;
}
float flowRate=0.28+(energy/36.0)*0.42;
vec2 loopVec=vec2(cos(a),sin(a))*flowRate;
vec2 loopVec2=vec2(sin(a*2.0),-cos(a*2.0))*(flowRate*0.55);
vec2 gasCoord=isoP*5.8+loopVec*1.35;
vec2 warpQ=vec2(
fbm(gasCoord+vec2(0.0,0.0)),
fbm(gasCoord+vec2(5.2,1.3))
)-0.5;
vec2 warpR=vec2(
fbm(gasCoord*1.85+1.6*warpQ+vec2(1.7,9.2)+loopVec2),
fbm(gasCoord*1.85+1.6*warpQ+vec2(8.3,2.8)-loopVec2)
)-0.5;
float gasBillows=fbm(gasCoord*1.4+1.25*warpR);
float gasTendrils=smoothstep(0.28,0.78,fbm(gasCoord*2.9-1.4*warpQ+loopVec2));
vec2 curlV=vec2(warpR.y-warpQ.y,-(warpR.x-warpQ.x))*2.2;
float idleScale=clamp(idleEvap/58.0,0.0,1.65);
float structuralLock;
float zoneSum;
if(motifMode>0.5){
float symCrispCore=bell(p4,vec2(0.565,0.405),vec2(0.095,0.155));
structuralLock=clamp(symCrispCore*0.85,0.0,0.92);
float symLowerLeft=rotBell(p4,vec2(0.445,0.585),vec2(0.168,0.208),-0.58);
float symLowerRight=bell(p4,vec2(0.615,0.635),vec2(0.128,0.148))*0.80;
float symTopRim=smoothstep(0.32,0.16,p4.y)*bell(p4,vec2(0.535,0.215),vec2(0.135,0.095))*0.45;
zoneSum=symLowerLeft*1.02+symLowerRight+symTopRim;
}else{
float innerCounter=bell(p4,vec2(0.525,0.475),vec2(0.068,0.125));
float crispSpine=bell(p4,vec2(0.585,0.360),vec2(0.055,0.165));
structuralLock=clamp(innerCounter*0.88+crispSpine*0.65,0.0,0.94);
float leftKneeZone=rotBell(p4,vec2(0.395,0.575),vec2(0.128,0.168),-0.58);
float diagMistZone=rotBell(p4,vec2(0.445,0.465),vec2(0.088,0.158),-0.60)*0.68;
float rightTipZone=bell(p4,vec2(0.655,0.610),vec2(0.075,0.085))*0.76;
float stemFootZone=smoothstep(0.66,0.85,p4.y)*bell(p4,vec2(0.595,0.785),vec2(0.085,0.120))*0.70;
float topBevelVeil=smoothstep(0.28,0.15,p4.y)*bell(p4,vec2(0.555,0.195),vec2(0.095,0.075))*0.40;
zoneSum=leftKneeZone*1.02+diagMistZone+rightTipZone+stemFootZone+topBevelVeil;
}
vec2 idleFlowCoord=isoP*3.6+loopVec*0.85;
float silkFbm1=fbm(idleFlowCoord);
float silkFbm2=clamp(silkFbm1*0.62+(warpQ.x+0.5)*0.38,0.0,1.0);
float silkMod=mix(0.76,1.26,silkFbm1*0.55+silkFbm2*0.45);
float idleGasTexture=0.52+0.52*gasBillows+0.38*gasTendrils;
float idleDiffusion=clamp(
zoneSum*
silkMod*
idleGasTexture*
(1.0-structuralLock)*
idleScale,
0.0,
1.0
);
float hoverGasField=0.0;
vec2 fromCursor=vec2(0.0);
if(focusAmount>0.002 && fourEvap>0.5){
float hoverScale=clamp(fourEvap/54.0,0.0,1.6);
vec2 cursorPWorld=focusPoint+pointer*0.028;
vec2 cursorP=(cursorPWorld-fourCenter)/s4+vec2(0.54,0.50);
float dCursorTo4=sdMotif(cursorP)*s4;
float cursorProximityTo4=exp(-pow(max(dCursorTo4,0.0)/0.18,2.0));
float activeHover=focusAmount*cursorProximityTo4*hoverScale;
fromCursor=vec2((p4World.x-cursorPWorld.x)*1.7778,p4World.y-cursorPWorld.y);
float distCursor=length(fromCursor);
vec2 warpedFromCursor=fromCursor+warpQ*0.055+warpR*0.032;
float gasEnvelope=exp(-dot(warpedFromCursor,warpedFromCursor)/(0.145*0.145))*(1.0-smoothstep(0.11,0.25,distCursor));
hoverGasField=clamp(gasEnvelope*(0.45+0.55*gasBillows+0.45*gasTendrils)*activeHover,0.0,1.0);
}
float tapWisp=0.0;
if(tapAge<3.5){
vec2 tapPWorld=tap+pointer*0.028;
vec2 tapP=(tapPWorld-fourCenter)/s4+vec2(0.54,0.50);
float dTapTo4=sdMotif(tapP)*s4;
float tapOnFour=1.0-smoothstep(0.01,0.24,max(dTapTo4,0.0));
vec2 fromTap=vec2((p4World.x-tapPWorld.x)*1.7778,p4World.y-tapPWorld.y);
float tapDist=length(fromTap+warpQ*0.035);
float waveRadius=0.02+0.55*(1.0-exp(-tapAge*1.4));
float ringWidth=0.05+tapAge*0.028;
float tapRings=exp(-pow((tapDist-waveRadius)/ringWidth,2.0));
tapWisp=clamp(tapRings*exp(-tapAge*1.25)*smoothstep(0.0,0.03,tapAge)*tapOnFour,0.0,1.0);
}
float totalDiffusion=clamp(idleDiffusion+hoverGasField*0.82+tapWisp*0.65,0.0,1.0);
float diffSq=totalDiffusion*totalDiffusion;
float dCore=dExact;
float dStratum1=dExact;
float dStratum2=dExact;
float dStratum3=dExact;
if(totalDiffusion>=0.012){
vec2 idleFlowDir=mix(vec2(-0.56,-0.36),vec2(0.46,-0.44),smoothstep(0.46,0.62,p4.x));
vec2 idleBuoyantCurl=normalize(curlV*0.88+idleFlowDir*0.92+vec2(0.0001));
vec2 idleAdvect=(idleBuoyantCurl*(0.46+0.54*gasTendrils)+warpQ*0.52+warpR*0.56)*0.034*idleDiffusion;
vec2 hoverAdvect=vec2(0.0);
if(hoverGasField>0.001){
vec2 buoyantCurl=normalize(curlV+vec2(fromCursor.x*1.2,-0.55)+vec2(0.0001));
hoverAdvect=(buoyantCurl*(0.45+0.55*gasTendrils)+warpR*0.65)*0.028*hoverGasField;
}
vec2 totalAdvect=idleAdvect+hoverAdvect;
float warpScale=idleDiffusion*0.84+hoverGasField;
dCore=sdMotif(p4+totalAdvect*0.24);
dStratum1=sdMotif(p4+totalAdvect*0.68+warpQ*(0.009*warpScale));
dStratum2=sdMotif(p4+totalAdvect*1.22+vec2(-warpQ.y,warpQ.x)*(0.015*warpScale));
dStratum3=sdMotif(p4+totalAdvect*1.85+warpR*(0.022*warpScale));
}
float baseFeather=mix(0.0022,0.00075,structuralLock)/s4;
float sigmaCore=(baseFeather+diffSq*0.030)*soft;
float sigmaS1=(0.0035+totalDiffusion*0.048)*soft;
float sigmaS2=(0.0080+totalDiffusion*0.088)*soft;
float sigmaS3=(0.0160+totalDiffusion*0.138)*soft;
float densityCore=1.0-smoothstep(-sigmaCore,sigmaCore,mix(dExact,dCore,smoothstep(0.04,0.38,totalDiffusion)));
float densityS1=(1.0-smoothstep(-sigmaS1,sigmaS1,dStratum1))*smoothstep(0.02,0.32,totalDiffusion);
float densityS2=(1.0-smoothstep(-sigmaS2,sigmaS2,dStratum2))*smoothstep(0.06,0.50,totalDiffusion)*(0.68+0.32*silkFbm2);
float densityS3=(1.0-smoothstep(-sigmaS3,sigmaS3,dStratum3))*smoothstep(0.12,0.70,totalDiffusion)*(0.55+0.45*gasBillows);
float pocketMask=smoothstep(0.22,0.76,1.0-gasBillows*0.65-gasTendrils*0.35);
float gasPocketErosion=hoverGasField*pocketMask*0.46;
float idlePocketErosion=idleDiffusion*pocketMask*0.34+idleDiffusion*idleDiffusion*0.14;
float coreRetention=clamp(1.0-gasPocketErosion-idlePocketErosion,0.30,1.0);
float innerDepth=max(-dCore,0.0);
float rimWidth=0.016+totalDiffusion*0.026;
float rimHighlight=exp(-(innerDepth*innerDepth)/(rimWidth*rimWidth));
float gasCaustic=(idleDiffusion*0.60+hoverGasField)*gasTendrils*exp(-pow(abs(dStratum1)/0.030,2.0))*0.55;
float bodyLuminance=mix(0.82,1.0,rimHighlight)*(1.0-0.18*(idleDiffusion*0.65+hoverGasField)*(1.0-gasBillows))+gasCaustic;
float posOut=max(dStratum2,0.0);
float haloWidth=0.018+totalDiffusion*0.105;
float outerHalo=exp(-(posOut*posOut)/(haloWidth*haloWidth))*(0.18+0.82*totalDiffusion)*(0.72+0.28*silkFbm1);
vec2 shadeP=p4-vec2(0.595,0.595);
vec2 shadeRot=vec2(shadeP.x*0.78+shadeP.y*0.62,-shadeP.x*0.62+shadeP.y*0.78);
float stemShade=exp(-(shadeRot.x*shadeRot.x)/(0.062*0.062)-(shadeRot.y*shadeRot.y)/(0.155*0.155));
float shadeAtten=1.0-0.42*stemShade;
float compositeBody=mix(
densityCore*bodyLuminance,
densityCore*bodyLuminance*0.52+densityS1*0.34+densityS2*0.22+densityS3*0.14,
smoothstep(0.0,0.65,totalDiffusion)
)*coreRetention*shadeAtten;
float compositeGlow=(outerHalo*0.48+densityS2*0.24+densityS3*0.28+gasCaustic*0.35)*shadeAtten;
float opacityScale=clamp(fourOpacity/100.0,0.0,1.0);
vec3 fgCol=vec3(0.0);
float fgAlpha=0.0;
if(darkMode>0.5 || neutralMode>0.5){
vec3 coreTint=mix(vec3(186.0,224.0,255.0)/255.0,vec3(248.0,252.0,255.0)/255.0,0.50+0.50*rimHighlight*(1.0-totalDiffusion*0.35));
coreTint=mix(coreTint,vec3(102.0,164.0,245.0)/255.0,stemShade*0.58);
vec3 gasTint=mix(vec3(114.0,184.0,255.0)/255.0,vec3(208.0,238.0,255.0)/255.0,0.45+0.55*gasTendrils);
vec3 fourCol=mix(coreTint,gasTint,hoverGasField*0.55);
vec3 fourGlow=mix(vec3(96.0,168.0,252.0)/255.0,vec3(198.0,234.0,255.0)/255.0,smoothstep(0.68,0.18,p4.y));
blendOver(fgCol,fgAlpha,fourGlow,compositeGlow*0.40*opacityScale);
blendOver(fgCol,fgAlpha,fourCol,compositeBody*0.88*opacityScale);
}else{
vec3 fourColLight=mix(vec3(235.0,246.0,255.0)/255.0,vec3(255.0,255.0,255.0)/255.0,0.46+0.54*rimHighlight);
vec3 fourGlowLight=vec3(255.0,255.0,255.0)/255.0;
blendOver(fgCol,fgAlpha,fourGlowLight,compositeGlow*0.50*opacityScale);
blendOver(fgCol,fgAlpha,fourColLight,compositeBody*0.96*opacityScale);
}
gl_FragColor=vec4(clamp(fgCol+dither,0.0,1.0),fgAlpha);
}`;const particleVertex=`precision highp float;
attribute vec2 position;
attribute vec4 appearance;
uniform vec2 resolution;
varying vec4 style;
varying vec2 vPos;
void main(){
vPos=position;
gl_Position=vec4(position.x*2.0-1.0,1.0-position.y*2.0,0.0,1.0);
gl_PointSize=appearance.x*1.6*resolution.y/1080.0;
style=appearance;
}`;const particleFragment=`precision highp float;
uniform sampler2D glyph;
uniform float darkMode;
uniform float glyphRows;
varying vec4 style;
varying vec2 vPos;
void main(){
vec2 p=gl_PointCoord-0.5;
float c=cos(style.z),s=sin(style.z);
p=mat2(c,-s,s,c)*p+0.5;
float inside=step(0.0,p.x)*step(p.x,1.0)*step(0.0,p.y)*step(p.y,1.0);
if(inside<0.5){
gl_FragColor=vec4(0.0);
return;
}
float px=clamp(p.x,0.002,0.998);
float rowIdx=floor(style.w+0.0001);
float blurVal=max(0.0,style.w-rowIdx);
float py=(clamp(p.y,0.002,0.998)+rowIdx)/max(1.0,glyphRows);
float level=clamp(blurVal*10.0,0.0,3.0);
float lo=floor(level),hi=min(3.0,lo+1.0);
float a0=texture2D(glyph,vec2(px/4.0,py)).a;
float a=texture2D(glyph,vec2((px+lo)/4.0,py)).a;
float b=texture2D(glyph,vec2((px+hi)/4.0,py)).a;
float blurComp=1.0+level*0.58;
float mipAlpha=clamp(mix(a,b,fract(level))*blurComp,0.0,1.0);
if(darkMode>0.5){
vec3 haloTint=mix(vec3(152.0,222.0,255.0)/255.0,vec3(48.0,148.0,252.0)/255.0,smoothstep(0.20,0.68,vPos.y));
float darkShape=clamp(max(mipAlpha*1.15,a0*(0.74-0.08*level)),0.0,1.0);
float coreMask=smoothstep(0.20,0.72,a0)*(1.0-clamp(blurVal*2.0,0.0,0.78));
vec3 darkSpark=mix(haloTint,vec3(242.0,253.0,255.0)/255.0,coreMask);
float darkAlpha=clamp(darkShape*min(1.0,style.y*1.32),0.0,0.98);
gl_FragColor=vec4(darkSpark,darkAlpha);
}else{
float lightShape=clamp(max(mipAlpha*1.22,a0*(0.78-0.10*level)),0.0,1.0);
float coreMask=smoothstep(0.18,0.72,a0);
vec3 edgeTint=mix(vec3(168.0,216.0,255.0)/255.0,vec3(116.0,182.0,252.0)/255.0,smoothstep(0.55,0.05,vPos.y)*smoothstep(0.45,0.95,vPos.x));
vec3 lightSpark=mix(edgeTint,vec3(1.0),coreMask*0.92+0.08);
float lightAlpha=clamp(lightShape*min(1.0,style.y*1.45),0.0,0.98);
gl_FragColor=vec4(lightSpark,lightAlpha);
}
}`;const rand=n=>{const x=Math.sin(n*127.1+311.7)*43758.5453;return x-Math.floor(x);};const smooth=(a,b,x)=>{const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t);};const INF=1e12;const edt1d=(f,d,v,z,n)=>{v[0]=0;z[0]=-INF;z[1]=INF;let k=0;for(let q=1;q<n;q++){let s=(f[q]+q*q-(f[v[k]]+v[k]*v[k]))/(2*q-2*v[k]);while(s<=z[k]){k--;s=(f[q]+q*q-(f[v[k]]+v[k]*v[k]))/(2*q-2*v[k]);}k++;v[k]=q;z[k]=s;z[k+1]=INF;}k=0;for(let q=0;q<n;q++){while(z[k+1]<q)k++;const dx=q-v[k];d[q]=dx*dx+f[v[k]];}};const edt2d=(grid,width,height)=>{const maxDim=Math.max(width,height);const f=new Float64Array(maxDim);const d=new Float64Array(maxDim);const v=new Int32Array(maxDim);const z=new Float64Array(maxDim+1);for(let x=0;x<width;x++){for(let y=0;y<height;y++)f[y]=grid[y*width+x];edt1d(f,d,v,z,height);for(let y=0;y<height;y++)grid[y*width+x]=d[y];}for(let y=0;y<height;y++){const rowOffset=y*width;for(let x=0;x<width;x++)f[x]=grid[rowOffset+x];edt1d(f,d,v,z,width);for(let x=0;x<width;x++)grid[rowOffset+x]=Math.sqrt(d[x]);}};const simplifyLoop=(pts,epsilon)=>{if(pts.length<=4)return pts;const sqEps=epsilon*epsilon;const keep=new Uint8Array(pts.length);keep[0]=1;keep[pts.length-1]=1;const stack=[[0,pts.length-1]];while(stack.length>0){const[first,last]=stack.pop();let maxSqDist=0;let index=-1;const ax=pts[first][0];const ay=pts[first][1];const bx=pts[last][0];const by=pts[last][1];const dx=bx-ax;const dy=by-ay;const lenSq=dx*dx+dy*dy;for(let i=first+1;i<last;i++){let t=lenSq>1e-8?((pts[i][0]-ax)*dx+(pts[i][1]-ay)*dy)/lenSq:0;t=Math.max(0,Math.min(1,t));const px=ax+t*dx-pts[i][0];const py=ay+t*dy-pts[i][1];const sq=px*px+py*py;if(sq>maxSqDist){maxSqDist=sq;index=i;}}if(maxSqDist>sqEps&&index!==-1){keep[index]=1;stack.push([first,index],[index,last]);}}const out=[];for(let i=0;i<pts.length;i++){if(keep[i])out.push(pts[i]);}return out;};const buildSvgFromSdf=(sdf,size)=>{const step=2;const gSize=Math.floor((size-1)/step);const valAt=(gx,gy)=>sdf[Math.min(size-1,gy*step)*size+Math.min(size-1,gx*step)];const interp=(x1,y1,v1,x2,y2,v2)=>{const denom=v1-v2;const t=Math.abs(denom)>1e-6?Math.max(0,Math.min(1,v1/denom)):0.5;return[(x1+(x2-x1)*t)*step,(y1+(y2-y1)*t)*step];};const qKey=pt=>`${Math.round(pt[0] * 16)},${Math.round(pt[1] * 16)}`;const nextMap=new Map();const allSegs=[];const addSeg=(pA,pB)=>{const kA=qKey(pA);const kB=qKey(pB);if(kA===kB)return;const seg={a:pA,b:pB,kA,kB,used:false};allSegs.push(seg);let list=nextMap.get(kA);if(!list){list=[];nextMap.set(kA,list);}list.push(seg);};for(let gy=0;gy<gSize;gy++){for(let gx=0;gx<gSize;gx++){const v0=valAt(gx,gy);const v1=valAt(gx+1,gy);const v2=valAt(gx+1,gy+1);const v3=valAt(gx,gy+1);const mask=(v0<0?1:0)|(v1<0?2:0)|(v2<0?4:0)|(v3<0?8:0);if(mask===0||mask===15)continue;const top=()=>interp(gx,gy,v0,gx+1,gy,v1);const right=()=>interp(gx+1,gy,v1,gx+1,gy+1,v2);const bottom=()=>interp(gx,gy+1,v3,gx+1,gy+1,v2);const left=()=>interp(gx,gy,v0,gx,gy+1,v3);switch(mask){case 1:addSeg(left(),top());break;case 2:addSeg(top(),right());break;case 3:addSeg(left(),right());break;case 4:addSeg(right(),bottom());break;case 5:addSeg(left(),bottom());addSeg(top(),right());break;case 6:addSeg(top(),bottom());break;case 7:addSeg(left(),bottom());break;case 8:addSeg(bottom(),left());break;case 9:addSeg(bottom(),top());break;case 10:addSeg(top(),left());addSeg(bottom(),right());break;case 11:addSeg(bottom(),right());break;case 12:addSeg(right(),left());break;case 13:addSeg(right(),top());break;case 14:addSeg(top(),left());break;}}}const pathParts=[];for(const startSeg of allSegs){if(startSeg.used)continue;startSeg.used=true;const pts=[startSeg.a,startSeg.b];let currKey=startSeg.kB;const startKey=startSeg.kA;let guard=0;while(currKey!==startKey&&guard++<8000){const candidates=nextMap.get(currKey);if(!candidates)break;const nextSeg=candidates.find(s=>!s.used);if(!nextSeg)break;nextSeg.used=true;pts.push(nextSeg.b);currKey=nextSeg.kB;}if(pts.length<3)continue;const simplified=simplifyLoop(pts,0.7);if(simplified.length<3)continue;const coords=simplified.map((p,idx)=>`${idx === 0 ? 'M' : 'L'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join('');pathParts.push(coords+'Z');}const dAttr=pathParts.join(' ');return`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}"><path fill="#ffffff" fill-rule="evenodd" d="${dAttr}"/></svg>`;};const SparkMotif={size:512,cache:new Map(),pending:new Map(),fontPromise:null,lastReadyEntry:null,listeners:new Set(),onUpdate(fn){this.listeners.add(fn);return()=>this.listeners.delete(fn);},notify(entry){this.listeners.forEach(fn=>{try{fn(entry);}catch(_e){}});},getKey(s={}){if(s.motifSvg){return`svg:${s.motifSvg.length}:${s.motifSvg.slice(-48)}`;}const name=String(s.symbolName||'shield').trim().toLowerCase()||'shield';const fill=s.symbolFill?1:0;const weight=Math.round(Number(s.symbolWeight)||600);const round=Math.round(Number(s.symbolRound??100));return`sym:${name}:${fill}:${weight}:${round}`;},ensureFont(){if(this.fontPromise)return this.fontPromise;if(typeof FontFace==='undefined'||!document.fonts){this.fontPromise=Promise.resolve();return this.fontPromise;}this.fontPromise=document.fonts.load('600 256px "Google Symbols"','shield').then(()=>document.fonts.ready).catch(()=>{});return this.fontPromise;},computeFromAlphaCanvas(normCanvas,key,meta={}){const size=this.size;const ctx=normCanvas.getContext('2d',{willReadFrequently:true});const imgData=ctx.getImageData(0,0,size,size).data;const outside=new Float64Array(size*size);const inside=new Float64Array(size*size);for(let i=0;i<size*size;i++){const a=imgData[i*4+3]/255;if(a<=0.004){outside[i]=INF;inside[i]=0;}else if(a>=0.996){outside[i]=0;inside[i]=INF;}else{const delta=0.5-a;const o=Math.max(0,delta);const ins=Math.max(0,-delta);outside[i]=o*o;inside[i]=ins*ins;}}edt2d(outside,size,size);edt2d(inside,size,size);const sdf=new Float32Array(size*size);const rgbaBytes=new Uint8Array(size*size*4);const rawContours=[];for(let y=0;y<size;y++){for(let x=0;x<size;x++){const idx=y*size+x;const dist=outside[idx]-inside[idx];sdf[idx]=dist;const norm=Math.max(0,Math.min(1,0.5+dist/256));const u16=Math.round(norm*65535);const pIdx=idx*4;rgbaBytes[pIdx]=(u16>>8)&255;rgbaBytes[pIdx+1]=u16&255;rgbaBytes[pIdx+2]=dist<0?255:0;rgbaBytes[pIdx+3]=255;if(Math.abs(dist)<=1.35&&((x+y)&1)===0){const tcX=(x+0.5)/size;const tcY=(y+0.5)/size;const gx=(tcX-0.5)*0.96;const gy=(tcY-0.5)*0.96;const sx=0.54+gx/1.7778;const sy=0.50+gy;const idleW=Math.min(1.0,Math.max(0.25,smooth(-0.02,-0.22,gx)*smooth(-0.08,0.25,gy)+smooth(0.02,0.22,gx)*smooth(0.12,-0.22,gy)*0.85));rawContours.push([sx,sy,idleW]);}}}const contourPoints=[];const maxPts=280;if(rawContours.length>0){const stride=Math.max(1,Math.floor(rawContours.length/maxPts));for(let i=0;i<rawContours.length;i+=stride){contourPoints.push(rawContours[i]);}}const svgText=meta.svgText||buildSvgFromSdf(sdf,size);const entry={key,ready:true,rgbaBytes,contourPoints,svgText,symbolName:meta.symbolName||'shield',byteLength:new Blob([svgText]).size};this.cache.set(key,entry);this.lastReadyEntry=entry;this.notify(entry);return entry;},ensureReady(s={}){const key=this.getKey(s);if(this.cache.has(key)){return Promise.resolve(this.cache.get(key));}if(this.pending.has(key)){return this.pending.get(key);}const size=this.size;let promise;if(s.motifSvg){promise=new Promise(resolve=>{const img=new Image();img.onload=()=>{const c=document.createElement('canvas');c.width=size;c.height=size;const ctx=c.getContext('2d');ctx.clearRect(0,0,size,size);ctx.drawImage(img,0,0,size,size);const entry=this.computeFromAlphaCanvas(c,key,{symbolName:s.symbolName||'shield'});this.pending.delete(key);resolve(entry);};img.onerror=()=>{this.pending.delete(key);resolve(this.lastReadyEntry);};img.src=s.motifSvg;});}else{const symbolName=String(s.symbolName||'shield').trim().toLowerCase()||'shield';const fill=s.symbolFill?1:0;const weight=Math.max(100,Math.min(700,Math.round(Number(s.symbolWeight)||600)));const round=Math.max(0,Math.min(100,Math.round(Number(s.symbolRound??100))));promise=this.ensureFont().then(()=>{const scratch=document.createElement('canvas');scratch.width=size;scratch.height=size;const variation=`'FILL' ${fill}, 'wght' ${weight}, 'GRAD' 0, 'ROND' ${round}, 'opsz' 48`;scratch.style.cssText='position:fixed;left:-9999px;top:-9999px;width:512px;height:512px;opacity:0;pointer-events:none;z-index:-1;';scratch.style.fontOpticalSizing='none';scratch.style.fontFeatureSettings='"liga" 1';scratch.style.fontVariationSettings=variation;if(document.body){document.body.appendChild(scratch);void scratch.offsetWidth;void window.getComputedStyle(scratch).fontVariationSettings;}let normCanvas;try{const sctx=scratch.getContext('2d',{willReadFrequently:true});sctx.clearRect(0,0,size,size);sctx.fillStyle='#ffffff';sctx.textAlign='center';sctx.textBaseline='middle';sctx.font='10px sans-serif';sctx.font=`${weight} 340px "Google Symbols"`;if('fontVariationSettings'in sctx){try{sctx.fontVariationSettings=variation;}catch(_e){}}sctx.fillText(symbolName,size/2,size/2);const data=sctx.getImageData(0,0,size,size).data;let minX=size;let minY=size;let maxX=-1;let maxY=-1;for(let y=0;y<size;y++){for(let x=0;x<size;x++){if(data[(y*size+x)*4+3]>16){if(x<minX)minX=x;if(x>maxX)maxX=x;if(y<minY)minY=y;if(y>maxY)maxY=y;}}}normCanvas=document.createElement('canvas');normCanvas.width=size;normCanvas.height=size;const nctx=normCanvas.getContext('2d',{willReadFrequently:true});nctx.clearRect(0,0,size,size);if(maxX>=minX&&maxY>=minY){const bw=Math.max(1,maxX-minX+1);const bh=Math.max(1,maxY-minY+1);const targetSpan=328;const scale=targetSpan/Math.max(bw,bh);const dw=bw*scale;const dh=bh*scale;const dx=(size-dw)*0.5;const dy=(size-dh)*0.5;nctx.imageSmoothingEnabled=true;nctx.imageSmoothingQuality='high';nctx.drawImage(scratch,minX,minY,bw,bh,dx,dy,dw,dh);}}finally{scratch.remove();}const entry=this.computeFromAlphaCanvas(normCanvas,key,{symbolName});this.pending.delete(key);return entry;});}this.pending.set(key,promise);return promise;},getEntry(s={}){const key=this.getKey(s);const cached=this.cache.get(key);if(cached)return cached;this.ensureReady(s);return this.lastReadyEntry;}};const SparkGlyphAtlas={tileSize:256,atlasWidth:1024,atlasHeight:256,cache:new Map(),pending:new Map(),listeners:new Set(),defaultEntry:null,getKey(cfg={}){if(cfg.customGlyphUrl){return`url:${cfg.customGlyphUrl}`;}const type=cfg.shapeType==='text'?'text':'symbol';if(type==='text'){const txt=String(cfg.text??'4').trim()||'4';return`text:${txt}`;}const sym=String(cfg.symbol??'spark').trim().toLowerCase()||'spark';const fill=cfg.symbolFill!==false?1:0;return`symbol:${sym}:${fill}`;},onUpdate(fn){this.listeners.add(fn);return()=>this.listeners.delete(fn);},notify(entry){this.listeners.forEach(fn=>{try{fn(entry);}catch(_e){}});},buildMipAtlasFromTile(tileCanvas,isPrePadded=true){const atlas=document.createElement('canvas');atlas.width=this.atlasWidth;atlas.height=this.atlasHeight;const ctx=atlas.getContext('2d');ctx.clearRect(0,0,atlas.width,atlas.height);[0,2.5,6.5,14].forEach((blur,i)=>{ctx.filter='blur('+blur+'px)';if(isPrePadded){ctx.drawImage(tileCanvas,i*256,0,256,256);}else{ctx.drawImage(tileCanvas,i*256+48,48,160,160);}});ctx.filter='none';return atlas;},normalizeInkToTile(scratch){const sw=scratch.width;const sh=scratch.height;const sctx=scratch.getContext('2d',{willReadFrequently:true});const data=sctx.getImageData(0,0,sw,sh).data;let minX=sw;let minY=sh;let maxX=-1;let maxY=-1;for(let y=0;y<sh;y++){for(let x=0;x<sw;x++){if(data[(y*sw+x)*4+3]>16){if(x<minX)minX=x;if(x>maxX)maxX=x;if(y<minY)minY=y;if(y>maxY)maxY=y;}}}const tile=document.createElement('canvas');tile.width=256;tile.height=256;const tctx=tile.getContext('2d');tctx.clearRect(0,0,256,256);if(maxX>=minX&&maxY>=minY){const bw=Math.max(1,maxX-minX+1);const bh=Math.max(1,maxY-minY+1);const targetSpan=160;const scale=targetSpan/Math.max(bw,bh);const dw=bw*scale;const dh=bh*scale;const dx=(256-dw)*0.5;const dy=(256-dh)*0.5;tctx.imageSmoothingEnabled=true;tctx.imageSmoothingQuality='high';tctx.drawImage(scratch,minX,minY,bw,bh,dx,dy,dw,dh);}return tile;},renderTextEntry(text,key){const raw=String(text??'4');const clean=raw.trim().length>0?raw:'4';const chars=Array.from(clean).slice(0,16);const charCount=Math.max(1,chars.length);let atlasRows=1;while(atlasRows<charCount)atlasRows<<=1;const boxSize=384;const charBoxes=[];let unionMinY=boxSize;let unionMaxY=-1;let maxCharW=1;for(let c=0;c<charCount;c++){const ch=chars[c];if(!ch||ch.trim()===''){charBoxes.push({isSpace:true});continue;}const scratch=document.createElement('canvas');scratch.width=boxSize;scratch.height=boxSize;const sctx=scratch.getContext('2d',{willReadFrequently:true});sctx.clearRect(0,0,boxSize,boxSize);sctx.fillStyle='#ffffff';sctx.textAlign='center';sctx.textBaseline='alphabetic';sctx.font='700 220px Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';sctx.fillText(ch,boxSize*0.5,268);const data=sctx.getImageData(0,0,boxSize,boxSize).data;let minX=boxSize;let minY=boxSize;let maxX=-1;let maxY=-1;for(let y=0;y<boxSize;y++){for(let x=0;x<boxSize;x++){if(data[(y*boxSize+x)*4+3]>16){if(x<minX)minX=x;if(x>maxX)maxX=x;if(y<minY)minY=y;if(y>maxY)maxY=y;}}}if(maxX>=minX&&maxY>=minY){const bw=Math.max(1,maxX-minX+1);const bh=Math.max(1,maxY-minY+1);if(minY<unionMinY)unionMinY=minY;if(maxY>unionMaxY)unionMaxY=maxY;if(bw>maxCharW)maxCharW=bw;charBoxes.push({isSpace:false,canvas:scratch,minX,minY,maxX,maxY,bw,bh});}else{charBoxes.push({isSpace:true});}}const unionH=unionMaxY>=unionMinY?Math.max(1,unionMaxY-unionMinY+1):160;const unionCenterY=unionMaxY>=unionMinY?(unionMinY+unionMaxY)*0.5:boxSize*0.5;const targetSpan=160;const sharedScale=targetSpan/Math.max(1,maxCharW,unionH);const atlasCanvas=document.createElement('canvas');atlasCanvas.width=this.atlasWidth;atlasCanvas.height=this.tileSize*atlasRows;const actx=atlasCanvas.getContext('2d');actx.clearRect(0,0,atlasCanvas.width,atlasCanvas.height);let firstTileCanvas=null;for(let r=0;r<charCount;r++){const box=charBoxes[r];const tile=document.createElement('canvas');tile.width=256;tile.height=256;if(!box.isSpace){const tctx=tile.getContext('2d');tctx.clearRect(0,0,256,256);const dw=box.bw*sharedScale;const dh=box.bh*sharedScale;const dx=(256-dw)*0.5;const dy=128+(box.minY-unionCenterY)*sharedScale;tctx.imageSmoothingEnabled=true;tctx.imageSmoothingQuality='high';tctx.drawImage(box.canvas,box.minX,box.minY,box.bw,box.bh,dx,dy,dw,dh);[0,2.5,6.5,14].forEach((blur,colIdx)=>{actx.filter='blur('+blur+'px)';actx.drawImage(tile,colIdx*256,r*256,256,256);});actx.filter='none';}if(r===0)firstTileCanvas=tile;}const entry={key,ready:true,tileCanvas:firstTileCanvas,atlasCanvas,charCount,atlasRows,spaceMask:charBoxes.map(b=>Boolean(b.isSpace))};this.cache.set(key,entry);this.notify(entry);return entry;},ensureReady(cfg={}){const key=this.getKey(cfg);if(this.cache.has(key)){return Promise.resolve(this.cache.get(key));}if(this.pending.has(key)){return this.pending.get(key);}if(cfg.customGlyphUrl){const promise=new Promise(resolve=>{const img=new Image();img.onload=()=>{const tileCanvas=document.createElement('canvas');tileCanvas.width=256;tileCanvas.height=256;const tctx=tileCanvas.getContext('2d');tctx.clearRect(0,0,256,256);tctx.drawImage(img,0,0,256,256);const atlasCanvas=this.buildMipAtlasFromTile(tileCanvas,true);const entry={key,ready:true,tileCanvas,atlasCanvas,charCount:1,atlasRows:1,spaceMask:[false]};this.cache.set(key,entry);this.pending.delete(key);this.notify(entry);resolve(entry);};img.onerror=()=>{this.pending.delete(key);resolve(this.defaultEntry);};img.src=cfg.customGlyphUrl;});this.pending.set(key,promise);return promise;}const type=cfg.shapeType==='text'?'text':'symbol';if(type==='text'){return Promise.resolve(this.renderTextEntry(cfg.text,key));}const sym=String(cfg.symbol??'spark').trim().toLowerCase()||'spark';const fill=cfg.symbolFill!==false?1:0;const promise=SparkMotif.ensureFont().then(()=>{const size=512;const scratch=document.createElement('canvas');scratch.width=size;scratch.height=size;const variation=`'FILL' ${fill}, 'wght' 600, 'GRAD' 0, 'ROND' 100, 'opsz' 48`;scratch.style.cssText='position:fixed;left:-9999px;top:-9999px;width:512px;height:512px;opacity:0;pointer-events:none;z-index:-1;';scratch.style.fontOpticalSizing='none';scratch.style.fontFeatureSettings='"liga" 1';scratch.style.fontVariationSettings=variation;if(document.body){document.body.appendChild(scratch);void scratch.offsetWidth;void window.getComputedStyle(scratch).fontVariationSettings;}let tileCanvas;try{const sctx=scratch.getContext('2d',{willReadFrequently:true});sctx.clearRect(0,0,size,size);sctx.fillStyle='#ffffff';sctx.textAlign='center';sctx.textBaseline='middle';sctx.font='10px sans-serif';sctx.font='600 320px "Google Symbols"';if('fontVariationSettings'in sctx){try{sctx.fontVariationSettings=variation;}catch(_e){}}sctx.fillText(sym,size*0.5,size*0.5);tileCanvas=this.normalizeInkToTile(scratch);}finally{scratch.remove();}const atlasCanvas=this.buildMipAtlasFromTile(tileCanvas,true);const entry={key,ready:true,tileCanvas,atlasCanvas,charCount:1,atlasRows:1,spaceMask:[false]};this.cache.set(key,entry);this.pending.delete(key);this.notify(entry);return entry;});this.pending.set(key,promise);return promise;},getEntry(cfg={}){const key=this.getKey(cfg);const cached=this.cache.get(key);if(cached)return cached;if(!cfg.customGlyphUrl&&cfg.shapeType==='text'){return this.renderTextEntry(cfg.text,key);}this.ensureReady(cfg);return this.defaultEntry;},meshConfigFromSettings(s={},meshIndex=1){if(meshIndex===2){return{shapeType:s.spark2ShapeType||'symbol',symbol:s.spark2Symbol||'spark',symbolFill:s.spark2SymbolFill!==false,text:s.spark2Text??'4',customGlyphUrl:s.customGlyph2Url||null};}return{shapeType:s.sparkShapeType||'symbol',symbol:s.sparkSymbol||'spark',symbolFill:s.sparkSymbolFill!==false,text:s.sparkText??'4',customGlyphUrl:s.customGlyph1Url||null};}};class Renderer{constructor(canvas,assets='assets/spark.svg'){this.canvas=canvas;const gl=(this.gl=canvas.getContext('webgl',{alpha:false,antialias:false,preserveDrawingBuffer:true}));if(!gl){throw Error('This browser could not start the WebGL artwork renderer. Enable hardware acceleration and reload.');}const compileProgram=(vs,fs)=>{const p=gl.createProgram();for(const[type,src]of[[gl.VERTEX_SHADER,vs],[gl.FRAGMENT_SHADER,fs]]){const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){throw Error(gl.getShaderInfoLog(s));}gl.attachShader(p,s);gl.deleteShader(s);}gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS)){throw Error(gl.getProgramInfoLog(p));}return p;};this.program=compileProgram(vertex,fragment);this.particleProgram=compileProgram(particleVertex,particleFragment);this.buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);this.particleBuffer=gl.createBuffer();this.particleData=new Float32Array(20000*6);this.uniforms={};['resolution','viewScale','shift','pointer','tap','focusPoint','focusAmount','renderPass','darkMode','neutralMode','family','zoom','rotation','softness','beamIntensity','showFour','motifMode','fourSize','fourPosX','fourPosY','fourOpacity','idleEvap','fourEvap','grain','energy','phase','tapAge','seed','noiseMap','motifSdfMap'].forEach(n=>{this.uniforms[n]=gl.getUniformLocation(this.program,n);});this.posAttr=gl.getAttribLocation(this.program,'position');this.particlePosAttr=gl.getAttribLocation(this.particleProgram,'position');this.particleAppAttr=gl.getAttribLocation(this.particleProgram,'appearance');this.particleUniforms={resolution:gl.getUniformLocation(this.particleProgram,'resolution'),darkMode:gl.getUniformLocation(this.particleProgram,'darkMode'),glyphRows:gl.getUniformLocation(this.particleProgram,'glyphRows'),glyph:gl.getUniformLocation(this.particleProgram,'glyph')};const makeTexture=(nearest=false,repeat=false)=>{const t=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,t);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,nearest?gl.NEAREST:gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,nearest?gl.NEAREST:gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,repeat?gl.REPEAT:gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,repeat?gl.REPEAT:gl.CLAMP_TO_EDGE);return t;};this.texture=makeTexture(false,false);this.texture2=makeTexture(false,false);this.uploadedGlyph1Key=null;this.uploadedGlyph2Key=null;this.noiseTexture=makeTexture(true,true);this.motifTexture=makeTexture(true,false);this.uploadedMotifKey=null;gl.bindTexture(gl.TEXTURE_2D,this.motifTexture);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,1,1,0,gl.RGBA,gl.UNSIGNED_BYTE,new Uint8Array([255,255,0,255]));const urls=typeof assets==='string'?{glyph:assets}:assets;const buildProceduralNoise=texture=>{const sz=512;const buf=new Uint8Array(sz*sz*4);let st=0x6d2b79f5;const nextByte=()=>{st=(st+0x9e3779b9)|0;let z=st;z=Math.imul(z^(z>>>16),0x21f0aaad);z=Math.imul(z^(z>>>15),0x735a2d97);return((z^(z>>>15))>>>24)&255;};for(let i=0;i<sz*sz*4;i+=4){buf[i]=nextByte();buf[i+1]=nextByte();buf[i+2]=nextByte();buf[i+3]=255;}gl.bindTexture(gl.TEXTURE_2D,texture);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,sz,sz,0,gl.RGBA,gl.UNSIGNED_BYTE,buf);return Promise.resolve();};const loadDefaultGlyph=url=>
new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>{const source=document.createElement('canvas');source.width=1024;source.height=256;const ctx=source.getContext('2d');[0,2.5,6.5,14].forEach((blur,i)=>{ctx.filter='blur('+blur+'px)';ctx.drawImage(img,i*256+48,48,160,160);});ctx.filter='none';if(!SparkGlyphAtlas.defaultEntry){const tileCanvas=document.createElement('canvas');tileCanvas.width=256;tileCanvas.height=256;const tctx=tileCanvas.getContext('2d');tctx.drawImage(img,48,48,160,160);const defEntry={key:'symbol:spark:1',ready:true,tileCanvas,atlasCanvas:source,charCount:1,atlasRows:1,spaceMask:[false]};SparkGlyphAtlas.defaultEntry=defEntry;if(!SparkGlyphAtlas.cache.has('symbol:spark:1')){SparkGlyphAtlas.cache.set('symbol:spark:1',defEntry);}}[this.texture,this.texture2].forEach(tex=>{gl.bindTexture(gl.TEXTURE_2D,tex);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,source);gl.generateMipmap(gl.TEXTURE_2D);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR_MIPMAP_LINEAR);});this.uploadedGlyph1Key='symbol:spark:1';this.uploadedGlyph2Key='symbol:spark:1';resolve();};img.onerror=()=>reject(Error('An artwork texture could not be loaded.'));img.src=url;});const noisePromise=buildProceduralNoise(this.noiseTexture);const initialSymbolPromise=urls.motifSvg?SparkMotif.ensureReady({motifType:'symbol',motifSvg:urls.motifSvg}):Promise.resolve();const customGlyph1Promise=urls.customGlyph1Url?SparkGlyphAtlas.ensureReady({customGlyphUrl:urls.customGlyph1Url}):Promise.resolve();const customGlyph2Promise=urls.customGlyph2Url?SparkGlyphAtlas.ensureReady({customGlyphUrl:urls.customGlyph2Url}):Promise.resolve();this.ready=Promise.all([loadDefaultGlyph(urls.glyph),noisePromise,initialSymbolPromise,customGlyph1Promise,customGlyph2Promise]);}syncGlyphTexture(texture,currentKey,meshCfg){const entry=SparkGlyphAtlas.getEntry(meshCfg);if(!entry||!entry.ready||!entry.atlasCanvas)return currentKey;if(currentKey===entry.key)return currentKey;const gl=this.gl;gl.bindTexture(gl.TEXTURE_2D,texture);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,entry.atlasCanvas);if((entry.atlasRows||1)===1){gl.generateMipmap(gl.TEXTURE_2D);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR_MIPMAP_LINEAR);}else{gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);}return entry.key;}render(settings,time=0,interaction={}){const s={...defaults,...settings};const gl=this.gl;const u=this.uniforms;const a=anchors[s.family]||anchors[0];const delta=s.curve.map((v,i)=>v-s.center[i]);const baseAngle=Math.atan2(a[1][1]-a[0][1],a[1][0]-a[0][0]);const rotation=Math.atan2(delta[1],delta[0])-baseAngle;const zoom=1+(s.spread-80)*0.006+(Math.hypot(...delta)-Math.hypot(a[1][0]-a[0][0],a[1][1]-a[0][1]))*0.22;const shift=s.center.map((v,i)=>(v-a[0][i])*0.8);const dur=Math.max(1,s.duration||10);const phase=(((time%dur)+dur)%dur)/dur;const viewScale=framing.scale(this.canvas.width,this.canvas.height);const isDark=s.colorMode==='dark'?1:0;const isNeutral=s.colorMode==='neutral'?1:0;const isSymbol=s.motifType==='symbol';let motifEntry=null;if(s.showFour&&isSymbol){motifEntry=SparkMotif.getEntry(s);if(motifEntry&&motifEntry.ready&&this.uploadedMotifKey!==motifEntry.key){gl.bindTexture(gl.TEXTURE_2D,this.motifTexture);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,SparkMotif.size,SparkMotif.size,0,gl.RGBA,gl.UNSIGNED_BYTE,motifEntry.rgbaBytes);this.uploadedMotifKey=motifEntry.key;}}if(s.density>0){this.uploadedGlyph1Key=this.syncGlyphTexture(this.texture,this.uploadedGlyph1Key,SparkGlyphAtlas.meshConfigFromSettings(s,1));}if(s.secondMesh&&(s.density2??75)>0){this.uploadedGlyph2Key=this.syncGlyphTexture(this.texture2,this.uploadedGlyph2Key,SparkGlyphAtlas.meshConfigFromSettings(s,2));}const sceneInteraction={...interaction,pointer:(interaction.pointer||[0,0]).map((v,i)=>v*viewScale[i]),tap:framing.toScene(interaction.tap||[0.5,0.5],this.canvas.width,this.canvas.height),focus:framing.toScene(interaction.hover||[0.54,0.50],this.canvas.width,this.canvas.height)};const drawQuad=pass=>{gl.useProgram(this.program);gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);const p=this.posAttr;gl.enableVertexAttribArray(p);gl.vertexAttribPointer(p,2,gl.FLOAT,false,0,0);gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,this.noiseTexture);gl.uniform1i(u.noiseMap,0);gl.activeTexture(gl.TEXTURE1);gl.bindTexture(gl.TEXTURE_2D,this.motifTexture);gl.uniform1i(u.motifSdfMap,1);gl.uniform2f(u.resolution,this.canvas.width,this.canvas.height);gl.uniform2fv(u.viewScale,viewScale);gl.uniform2fv(u.shift,shift);gl.uniform2fv(u.pointer,sceneInteraction.pointer);gl.uniform2fv(u.tap,sceneInteraction.tap);gl.uniform2fv(u.focusPoint,sceneInteraction.focus);gl.uniform1f(u.focusAmount,interaction.hoverAmount||0);gl.uniform1f(u.renderPass,pass);gl.uniform1f(u.darkMode,isDark);gl.uniform1f(u.neutralMode,isNeutral);gl.uniform1f(u.tapAge,interaction.tapAge??10);gl.uniform1f(u.phase,phase);gl.uniform1f(u.zoom,zoom);gl.uniform1f(u.rotation,rotation);gl.uniform1f(u.showFour,s.showFour?1:0);gl.uniform1f(u.motifMode,isSymbol&&motifEntry?1:0);['family','seed','softness','beamIntensity','fourSize','fourPosX','fourPosY','fourOpacity','idleEvap','fourEvap','grain','energy'].forEach(n=>{gl.uniform1f(u[n],s[n]??defaults[n]);});if(pass>0){gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);}else{gl.disable(gl.BLEND);}gl.drawArrays(gl.TRIANGLES,0,6);gl.disable(gl.BLEND);gl.disableVertexAttribArray(p);};gl.viewport(0,0,this.canvas.width,this.canvas.height);drawQuad(0);if(s.density>0){this.drawSparks(s,phase,shift,zoom,rotation,sceneInteraction,'back',motifEntry,1);}if(s.secondMesh&&(s.density2??75)>0){this.drawSparks(s,phase,shift,zoom,rotation,sceneInteraction,'back',motifEntry,2);}if(s.showFour){drawQuad(1);}if(s.density>0){this.drawSparks(s,phase,shift,zoom,rotation,sceneInteraction,'front',motifEntry,1);}if(s.secondMesh&&(s.density2??75)>0){this.drawSparks(s,phase,shift,zoom,rotation,sceneInteraction,'front',motifEntry,2);}}drawSparks(s,phase,shift,zoom,rotation,interaction,layerPass='all',motifEntry=null,meshIndex=1){const isSecond=meshIndex===2;const meshDensity=isSecond?(s.density2??75):(s.density??90);if(meshDensity<=0)return;const isLight=s.colorMode==='light';const rawModeOpacity=isLight?(isSecond?(s.spark2OpacityLight??75):(s.sparkOpacityLight??75)):(isSecond?(s.spark2OpacityDark??75):(s.sparkOpacityDark??75));const modeOpacity=Math.max(0,Math.min(100,rawModeOpacity))/100;if(modeOpacity<=0.001)return;const meshCfg=SparkGlyphAtlas.meshConfigFromSettings(s,meshIndex);const glyphEntry=SparkGlyphAtlas.getEntry(meshCfg);const charCount=glyphEntry?.charCount||1;const atlasRows=glyphEntry?.atlasRows||1;const spaceMask=glyphEntry?.spaceMask||null;const meshShapeType=meshCfg.shapeType;const spinScale=meshShapeType==='text'?0.18:1.0;const meshScaleVal=isSecond?(s.spark2Scale??100):(s.sparkScale??100);const meshFalloffVal=isSecond?(s.spark2SizeFalloff??50):(s.sparkSizeFalloff??50);const meshDepthVal=isSecond?(s.meshDepth2??80):(s.meshDepth??80);const meshPosX=isSecond?(s.spark2PosX??-15):(s.sparkPosX??10);const meshPosY=isSecond?(s.spark2PosY??10):(s.sparkPosY??25);const activeTexture=isSecond?this.texture2:this.texture;const meshSeed=(s.seed||0)+(isSecond?517:0);const meshPhase=(phase+(isSecond?0.37:0))%1;const gl=this.gl;const canvasW=this.canvas.width;const canvasH=this.canvas.height;const invCanvasW=1/canvasW;const invCanvasH=1/canvasH;const viewScale=framing.scale(canvasW,canvasH);const invViewScale0=1/viewScale[0];const invViewScale1=1/viewScale[1];const shortEdge=Math.min(canvasW,canvasH);const metric0=canvasW/shortEdge;const metric1=canvasH/shortEdge;const invMetric0=1/metric0;const invMetric1=1/metric1;const hover=interaction.hover;const reactivityScale=Math.max(0,Math.min(100,s.hoverReactivity??30))/65;const hoverSizeBoost=Math.max(0,Math.min(100,s.hoverSize??100))/50;const reach=0.07+Math.max(0,Math.min(100,s.reach??100))*0.0036;const reachSq=reach*reach;const rawHoverAmt=Math.max(0,Math.min(1,interaction.hoverAmount||0));const effectiveHoverAmt=rawHoverAmt*reactivityScale;const force=Math.max(0,Math.min(100,s.repulsion??45))*0.011*effectiveHoverAmt;const sparkOffX=meshPosX*0.0075;const sparkOffY=meshPosY*0.0075;const data=this.particleData;let count=0;const a=meshPhase*Math.PI*2;const waveAmp=meshDepthVal/60;const densityScale=0.52+meshDensity*0.0085;const promSize=(isLight?0.62:0.54)+s.prominence*0.0068;const scaleMult=Math.max(15,Math.min(300,meshScaleVal))/100;const falloffT=Math.max(0,Math.min(100,meshFalloffVal))/100;const opacityGain=modeOpacity<=0.75?modeOpacity/0.75:1.0+((modeOpacity-0.75)/0.25)*0.90;const promAlpha=((isLight?1.28:0.82)+s.prominence*(isLight?0.009:0.0068))*opacityGain;const lightBlurScale=isLight?0.56:1.0;const highOpacityRelax=1-0.45*Math.max(0,(modeOpacity-0.65)/0.35);const blurAtten=(isLight?0.72:1.28)*highOpacityRelax;const focusScene=interaction.focus||[0.54,0.50];const cosRot=Math.cos(rotation);const sinRot=Math.sin(rotation);const shiftOffX=0.5+shift[0]*0.55-Math.sin(a)*s.energy*0.00022;const shiftOffY=0.5+shift[1]*0.55-(Math.cos(a)-1)*s.energy*0.00022;const pointer=interaction.pointer||[0,0];const ptrScale=0.5+0.5*reactivityScale;const ptrX=pointer[0]*ptrScale;const ptrY=pointer[1]*ptrScale;const tapAge=interaction.tapAge??10;const hasTap=tapAge<4;const tap=interaction.tap||[0.5,0.5];const hasHover=Boolean(hover&&rawHoverAmt>0.005);const reactCoupling=0.35+0.65*Math.min(1.5,reactivityScale);const radiusFactor=(1.6*canvasH)/2160;const perspectiveSize=camProx=>1.08/(2.42-1.55*Math.max(0,Math.min(1,camProx)));const expFast=x=>(x<-12?0:Math.exp(x));const pow145=u=>(u<=0?0:u*(0.12*u+0.88*Math.sqrt(u)));const tapDecay=hasTap?expFast(-tapAge*2.2):0;const uniformBaseSize=2.15*promSize*scaleMult;const computeParticleSize=(layerBase,camProx,u,v,z,rVal)=>{if(falloffT<=0.001)return uniformBaseSize;const edgeTaper=smooth(0.0,0.32,u)*(1-0.65*smooth(0.78,1.0,u))*(1-0.60*smooth(0.62,0.98,v));const crestBoost=0.55+0.75*Math.max(0,Math.min(1,0.5+z*0.65));const depthFactor=perspectiveSize(camProx);const rCurve=Math.pow(rVal,1.6);const particleSpread=0.38+1.45*rCurve;const contrastExp=0.55+1.35*falloffT;const rawRatio=Math.max(0.16,(layerBase/2.15)*depthFactor*(0.45+0.75*edgeTaper)*crestBoost*particleSpread);const contrastedRatio=Math.pow(rawRatio,contrastExp);return uniformBaseSize*(1+(contrastedRatio-1)*Math.min(1,falloffT*1.35));};const cursorBlurShift=(x,y,baseBlur)=>{if(effectiveHoverAmt<0.001)return baseBlur;const sx=x+sparkOffX;const sy=y+sparkOffY;const w=Math.sin(sy*14+sx*9+a*2)*0.045;const dx=(sx-focusScene[0])*1.35+w;const dy=sy-focusScene[1]-w*0.7;const u1=dx*0.82-dy*0.57;const v1=dx*0.57+dy*0.82;const plume=expFast(-(u1*u1)/0.055-(v1*v1)/0.016);return Math.max(0.002,Math.min(0.28,baseBlur*(1-0.35*Math.min(1,effectiveHoverAmt)*plume)+0.08*effectiveHoverAmt*plume));};const emit=(x,y,zHeight,size,alpha,blur,spin,seedOffset,parallaxDepth=0.018,applySparkOffset=true,charIdx=0)=>{if(alpha<0.005||(spaceMask&&spaceMask[charIdx]))return;if(applySparkOffset){const rx=(x-0.5)*zoom;const ry=(y-0.5)*zoom;x=cosRot*rx-sinRot*ry+shiftOffX;y=sinRot*rx+cosRot*ry+shiftOffY;}else{x-=Math.sin(a)*s.energy*0.00010;y-=(Math.cos(a)-1)*s.energy*0.00010;}const effParallax=parallaxDepth*(1+zHeight*0.65);x-=ptrX*effParallax;y-=ptrY*effParallax;const localScreenX=(x-0.5)*invViewScale0+0.5;const localScreenY=(y-0.5)*invViewScale1+0.5;const fadeStart=0.54+0.26*smooth(0.32,0.95,localScreenX);alpha*=pow145(1-smooth(fadeStart,0.90,localScreenY));if(applySparkOffset){x+=sparkOffX;y+=sparkOffY;}let rippleBoost=0;if(hasTap){const dx=x-tap[0];const dy=y-tap[1];const d=Math.sqrt(dx*dx+dy*dy)+0.00001;const wave=Math.sin(d*34-tapAge*7.5)*tapDecay;x-=(dx/d)*wave*0.012;y-=(dy/d)*wave*0.012;rippleBoost=Math.max(0,wave*0.25);}x=(x-0.5)*invViewScale0+0.5;y=(y-0.5)*invViewScale1+0.5;let cursorLift=0;let sizeMultiplier=1;if(hasHover){const dx=(x-hover[0])*metric0;const dy=(y-hover[1])*metric1;const distSq=dx*dx+dy*dy;if(distSq<reachSq){const distance=Math.sqrt(distSq);const falloff=1-smooth(0,reach,distance);const smoothBell=pow145(falloff);if(effectiveHoverAmt>0.005){const push=reach*0.85*force*smoothBell*(0.85+0.3*zHeight);const wave3D=Math.sin(distance*22-a*2)*0.007*effectiveHoverAmt*smoothBell;let dirX,dirY;if(distance>0.00001){const invDist=1/distance;dirX=dx*invDist;dirY=dy*invDist;}else{const angle=rand(seedOffset+meshSeed)*Math.PI*2;dirX=Math.cos(angle);dirY=Math.sin(angle);}const swirl=0.0045*effectiveHoverAmt*smoothBell*(zHeight*0.5+0.5);x+=(dirX*(push+wave3D)-dirY*swirl)*invMetric0;y+=(dirY*(push+wave3D)+dirX*swirl)*invMetric1;cursorLift=smoothBell*effectiveHoverAmt*0.34;}if(hoverSizeBoost>0.005){const individualHarmonic=0.78+0.44*Math.sin(a*2+rand(seedOffset*1.7+meshSeed)*6.283);sizeMultiplier=1+hoverSizeBoost*rawHoverAmt*reactCoupling*smoothBell*individualHarmonic*1.15;blur=Math.max(0.002,blur*(1-0.55*smoothBell*Math.min(1,hoverSizeBoost*rawHoverAmt)));}}}const finalSize=size*sizeMultiplier*(1+cursorLift*0.22+rippleBoost);const finalAlpha=Math.min(0.98,alpha*(1+rippleBoost));const safeBlur=Math.max(0.001,Math.min(0.48,blur));const spriteSize=finalSize*(1+safeBlur*1.5)*invViewScale1;const radius=spriteSize*radiusFactor;const rxBound=radius*invCanvasW;const ryBound=radius*invCanvasH;if(x<-rxBound||x>1+rxBound||y<-ryBound||y>1+ryBound||finalAlpha<0.005||count>=20000){return;}const k=count++*6;data[k]=x;data[k+1]=y;data[k+2]=spriteSize;data[k+3]=finalAlpha;data[k+4]=spin*spinScale;data[k+5]=charIdx+safeBlur;};const speedFactor=0.25+(s.energy/36)*0.75;const alignRows=r=>(charCount>1?Math.max(charCount,Math.round(r/charCount)*charCount):r);const rowStep=charCount===2?1:2;if(layerPass!=='front'){const cols1=Math.max(8,Math.round(52*densityScale));const rows1=alignRows(Math.max(6,Math.round(32*densityScale)));for(let j=0;j<rows1;j++){for(let i=0;i<cols1;i++){const u=i/(cols1-1);const v=(j/rows1+meshPhase*0.35*speedFactor)%1;const wavePhase1=u*5.2+v*3.8-a;const wavePhase2=u*3.4-v*5.6+a;const z=(0.58*Math.sin(wavePhase1)+0.42*Math.cos(wavePhase2))*waveAmp;const dZdu=(0.58*5.2*Math.cos(wavePhase1)-0.42*3.4*Math.sin(wavePhase2))*waveAmp*0.0045;const dZdv=(0.58*3.8*Math.cos(wavePhase1)+0.42*5.6*Math.sin(wavePhase2))*waveAmp*0.0045;const baseX=0.46+u*0.54-v*0.14;const baseY=-0.04+v*0.62-(1-u)*0.10;const x=baseX+dZdu+0.018*Math.sin(v*4.4+u*2.6-a)*waveAmp;const y=baseY+dZdv-z*0.028*waveAmp;const edgeFade=smooth(0.02,0.22,u)*(1-smooth(0.88,0.99,u))*smooth(0.02,0.18,v)*(1-smooth(0.74,0.97,v));const rightBoost=(isLight?0.58:0.42)+(isLight?0.42:0.58)*smooth(0.54,0.92,x)*smooth(0.58,0.06,y);const camProx=Math.max(0,Math.min(1,0.18+0.24*smooth(0.08,0.90,v)+0.18*z));const baseBlur=Math.min(0.26,0.004+0.13*smooth(0.25,0.85,1-u)+0.07*Math.abs(z-0.15))*lightBlurScale;const progBlur=cursorBlurShift(x,y,baseBlur);const rSize=rand(i*3.1+j*7.7+meshSeed);const size=computeParticleSize(1.9,camProx,u,v,z,rSize);const ridgeHighlight=0.78+0.32*Math.max(0,z);const alpha=(isLight?0.46:0.38)*edgeFade*rightBoost*ridgeHighlight*promAlpha;const charIdx=charCount>1?(i+j*rowStep)%charCount:0;emit(x,y,z,size,alpha,progBlur,0.22+u*0.48-v*0.18,i*17+j*31,0.010+0.012*camProx,true,charIdx);}}const cols2=Math.max(8,Math.round(46*densityScale));const rows2=alignRows(Math.max(6,Math.round(28*densityScale)));for(let j=0;j<rows2;j++){for(let i=0;i<cols2;i++){const u=i/(cols2-1);const v=(j/rows2+meshPhase*0.55*speedFactor+0.33)%1;const z=(Math.sin(u*4.6-v*3.2-a)+0.45*Math.sin(v*5.2+u*2.8+a))*waveAmp;const arch=Math.sin(u*4.2-0.7)+0.28*Math.sin(v*4.4-u*2.4-a);const x=0.28+u*0.66+0.026*Math.sin(v*4.8+u*2.3-a)*waveAmp;const y=0.06+v*0.68+0.052*arch*waveAmp-z*0.024;const camProx=Math.max(0,Math.min(1,0.26+0.30*smooth(0.06,0.92,v)+0.22*z));const focalDist=Math.abs(v-0.44+0.32*(u-0.58)-z*0.15);const baseBlur=Math.min(0.28,0.01+0.21*smooth(0.04,0.44,focalDist))*lightBlurScale;const progBlur=cursorBlurShift(x,y,baseBlur);const mask=smooth(0.04,0.24,u)*(1-smooth(0.85,0.99,u))*smooth(0.04,0.22,v)*(1-smooth(0.80,0.97,v));const rSize=rand(i*5.3+j*9.1+meshSeed);const size=computeParticleSize(2.2,camProx,u,v,z,rSize);const alpha=(isLight?0.44:0.34)*mask*(1-progBlur*blurAtten)*promAlpha*(0.85+0.15*rSize);const charIdx=charCount>1?(i+j*rowStep)%charCount:0;emit(x,y,z,size,alpha,progBlur,0.28+u*0.52-v*0.22,i*23+j*41+1000,0.016+0.018*camProx,true,charIdx);}}}if(layerPass!=='back'){const cols3=Math.max(8,Math.round(44*densityScale));const rows3=alignRows(Math.max(6,Math.round(26*densityScale)));for(let j=0;j<rows3;j++){for(let i=0;i<cols3;i++){const u=i/(cols3-1);const v=(j/rows3+meshPhase*0.68*speedFactor+0.67)%1;const z=(0.65*Math.cos(u*4.0+v*3.6-a)+0.35*Math.sin(v*6.0-a))*waveAmp;const x=0.38+u*0.58+0.028*Math.cos(v*4.8+u*2.2-a)*waveAmp;const y=0.04+v*0.64+0.046*Math.sin(u*3.8-0.6)*waveAmp-z*0.032;const wingMask=smooth(0.04,0.22,u)*(1-smooth(0.86,0.99,u))*smooth(0.04,0.20,v)*(1-smooth(0.78,0.96,v));const camProx=Math.max(0,Math.min(1,0.38+0.34*smooth(0.08,0.92,v)+0.24*z));const focal=Math.abs(v-0.38-0.26*(u-0.58)+z*0.12);const baseBlur=Math.min(0.26,0.004+0.22*smooth(0.06,0.45,focal))*lightBlurScale;const progBlur=cursorBlurShift(x,y,baseBlur);const rSize=rand(i*7.9+j*11.3+meshSeed);const size=computeParticleSize(2.45,camProx,u,v,z,rSize);const alpha=(isLight?0.48:0.38)*wingMask*(1-progBlur*blurAtten)*promAlpha;const charIdx=charCount>1?(i+j*rowStep)%charCount:0;emit(x,y,z,size,alpha,progBlur,0.32+u*0.4-v*0.15,i*29+j*53+3000,0.024+0.026*camProx,true,charIdx);}}if(s.showFour&&!isSecond){const s4=Math.max(0.4,Math.min(2.0,(s.fourSize??100)/100));const offX=(s.fourPosX??0)*0.0075;const offY=(s.fourPosY??0)*0.0075;const idleStrength=Math.max(0,(s.idleEvap??58)/58);const hoverStrength=rawHoverAmt*Math.max(0,(s.fourEvap??54)/54);const symbolContours=s.motifType==='symbol'&&motifEntry?.contourPoints?.length?motifEntry.contourPoints:null;if(idleStrength>0.05||hoverStrength>0.02){const evapCount=Math.round(115*densityScale);for(let k=0;k<evapCount;k++){const r1=rand(k*13.7+s.seed);const r2=rand(k*29.3+s.seed);const r3=rand(k*47.1+s.seed);const life=(r1+phase*1.0)%1;let spawnX,spawnY,isIdleZone;if(symbolContours){const pt=symbolContours[Math.floor(r2*symbolContours.length)%symbolContours.length];spawnX=pt[0]+(rand(k*5.3)-0.5)*0.026;spawnY=pt[1]+(rand(k*9.7)-0.5)*0.026;isIdleZone=pt[2];}else if(r2<0.52){const t=r3*0.65;spawnX=0.395+t*0.14+(rand(k*5.3)-0.5)*0.038;spawnY=0.585-t*0.24+(rand(k*9.7)-0.5)*0.038;isIdleZone=1.0;}else if(r2<0.78){const t=r3;spawnX=0.40+t*0.25;spawnY=0.575+(rand(k*11.3)-0.5)*0.035;isIdleZone=smooth(0.55,0.95,t)*0.80;}else{const t=r3;spawnX=0.585+(rand(k*7.1)-0.5)*0.040;spawnY=0.32+t*0.44;isIdleZone=smooth(0.65,0.95,t)*0.72;}spawnX=(spawnX-0.54)*s4+0.50+offX;spawnY=(spawnY-0.50)*s4+0.50+offY;const curlAngle=r1*6.283+life*2.85+a;const driftRadius=life*(0.056+0.048*r3);const px=spawnX+(-0.48*driftRadius+Math.cos(curlAngle)*0.024*life);const py=spawnY+(-0.68*driftRadius+Math.sin(curlAngle)*0.022*life);let cursorTrigger=0;if(hoverStrength>0.002){const cdx=(spawnX-focusScene[0])*1.6;const cdy=spawnY-focusScene[1];cursorTrigger=expFast(-(cdx*cdx+cdy*cdy)/(0.16*0.16))*hoverStrength;}const idleTrigger=isIdleZone*idleStrength*(isLight?0.62:0.52);const activeTrigger=Math.min(1.0,idleTrigger+cursorTrigger*0.85);const env=Math.sin(life*Math.PI)*(1-life*0.35)*activeTrigger;if(env>0.012){const blur=(0.012+life*0.16)*lightBlurScale;const sz=(1.35+1.45*(1-life)*(0.7+0.6*r3))*promSize*scaleMult;emit(px,py,0.45+life*0.4,sz,env*(isLight?0.78:0.58)*opacityGain,blur,r1*3.14+life*0.8,k+8000,0.028,false,k%charCount);}}}}}if(count===0)return;gl.useProgram(this.particleProgram);gl.bindBuffer(gl.ARRAY_BUFFER,this.particleBuffer);gl.bufferData(gl.ARRAY_BUFFER,data.subarray(0,count*6),gl.DYNAMIC_DRAW);const p=this.particlePosAttr;const ap=this.particleAppAttr;const pu=this.particleUniforms;gl.enableVertexAttribArray(p);gl.vertexAttribPointer(p,2,gl.FLOAT,false,24,0);gl.enableVertexAttribArray(ap);gl.vertexAttribPointer(ap,4,gl.FLOAT,false,24,8);gl.uniform2f(pu.resolution,canvasW,canvasH);gl.uniform1f(pu.darkMode,isLight?0:1);gl.uniform1f(pu.glyphRows,atlasRows);gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,activeTexture);gl.uniform1i(pu.glyph,0);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.drawArrays(gl.POINTS,0,count);gl.disable(gl.BLEND);gl.disableVertexAttribArray(p);gl.disableVertexAttribArray(ap);}destroy(){const g=this.gl;g.deleteTexture(this.texture);g.deleteTexture(this.texture2);g.deleteTexture(this.noiseTexture);g.deleteTexture(this.motifTexture);g.deleteBuffer(this.buffer);g.deleteBuffer(this.particleBuffer);g.deleteProgram(this.program);g.deleteProgram(this.particleProgram);g.getExtension('WEBGL_lose_context')?.loseContext();}}class PointerInteraction{constructor(host,enabled=()=>true,onWake=null){this.reset();this.host=host;this.enabled=enabled;this.onWake=onWake;this.move=e=>{if(!enabled()||e.pointerType==='touch')return;const r=host.getBoundingClientRect();if(!r.width||!r.height)return;this.target=[(e.clientX-r.left)/r.width,(e.clientY-r.top)/r.height];if(!this.inside&&this.amount<0.01){this.hover=[...this.target];}this.inside=true;if(this.onWake)this.onWake();};this.leave=()=>{this.inside=false;};this.down=e=>{if(!enabled())return;const r=host.getBoundingClientRect();if(!r.width||!r.height)return;this.tap=[(e.clientX-r.left)/r.width,(e.clientY-r.top)/r.height];this.tapTime=performance.now();if(this.onWake)this.onWake();};this.clear=()=>this.reset();host.addEventListener('pointermove',this.move);host.addEventListener('pointerenter',this.move);host.addEventListener('pointerleave',this.leave);host.addEventListener('pointercancel',this.leave);host.addEventListener('pointerdown',this.down);global.addEventListener('blur',this.clear);}reset(){this.pointer=[0,0];this.target=[0.54,0.50];this.hover=[0.54,0.50];this.inside=false;this.amount=0;this.tap=[0.54,0.50];this.tapTime=-10000;}isActive(now=performance.now(),settings={}){if(!this.enabled())return false;const tapActive=Boolean(settings.ripple&&(now-this.tapTime)/1000<4.0);return(this.inside||this.amount>0.0015||Math.abs(this.pointer[0])>0.0005||Math.abs(this.pointer[1])>0.0005||tapActive);}sample(dt,now,settings){if(!this.enabled()){this.reset();return{};}const follow=1-Math.exp(-Math.max(0,dt)*6.2);const ease=1-Math.exp(-Math.max(0,dt)*(this.inside?5.5:2.0));this.hover=this.hover.map((v,i)=>v+(this.target[i]-v)*follow);this.amount+=((this.inside?1:0)-this.amount)*ease;if(this.amount<0.0001)this.amount=0;this.pointer=this.pointer.map((v,i)=>v+((this.inside?this.target[i]-0.5:0)-v)*follow);return{pointer:settings.parallax?this.pointer:[0,0],hover:this.hover,hoverAmount:this.amount,tap:this.tap,tapAge:settings.ripple?(now-this.tapTime)/1000:10};}destroy(){const h=this.host;h.removeEventListener('pointermove',this.move);h.removeEventListener('pointerenter',this.move);h.removeEventListener('pointerleave',this.leave);h.removeEventListener('pointercancel',this.leave);h.removeEventListener('pointerdown',this.down);global.removeEventListener('blur',this.clear);}}global.SparkGlyphAtlas=SparkGlyphAtlas;global.SparkMotif=SparkMotif;global.SparkPointerInteraction=PointerInteraction;global.SparkRenderer=Renderer;global.SparkDefaults=defaults;global.SparkFraming=framing;})(window);(function(){'use strict';const settings=window.SparkSceneConfig;if(!settings||!window.SparkRenderer)return;const parseRatio=(raw,fallbackRw,fallbackRh)=>{const defW=fallbackRw||16;const defH=fallbackRh||9;if(!raw)return null;const str=String(raw).trim().toLowerCase();if(str==='original'||str==='container'||str==='auto'){return{mode:'original',rw:defW,rh:defH};}const m=str.match(/^(\d+(?:\.\d+)?)\s*[:/]\s*(\d+(?:\.\d+)?)$/);if(m){const rw=parseFloat(m[1]);const rh=parseFloat(m[2]);if(rw>0&&rh>0)return{mode:'locked',rw,rh};}return null;};const baseParsed=parseRatio(settings.aspectRatio||settings.ratio,16,9)||{mode:'original',rw:16,rh:9};let activeRatio=baseParsed;try{const params=new URLSearchParams(window.location.search);const urlRatio=params.get('aspectRatio')||params.get('ratio');if(urlRatio){const p=parseRatio(urlRatio,baseParsed.rw,baseParsed.rh);if(p)activeRatio=p;}}catch{}let sameOriginManaged=false;try{const frameEl=window.frameElement;if(frameEl){const doc=frameEl.ownerDocument;const win=doc.defaultView;sameOriginManaged=true;frameEl.setAttribute('width','100%');frameEl.setAttribute('frameborder','0');if(!frameEl.style.border)frameEl.style.border='0';frameEl.style.display='block';frameEl.style.width='100%';const syncFrame=()=>{const parent=frameEl.parentElement;const attrRatio=frameEl.getAttribute('data-aspect-ratio')||frameEl.getAttribute('data-ratio')||frameEl.getAttribute('aspect-ratio')||(parent&&(parent.getAttribute('data-aspect-ratio')||parent.getAttribute('data-ratio')||parent.getAttribute('aspect-ratio')));if(attrRatio){const p=parseRatio(attrRatio,baseParsed.rw,baseParsed.rh);if(p)activeRatio=p;}if(activeRatio.mode==='original'){frameEl.style.aspectRatio='auto';frameEl.style.height='100%';frameEl.style.minHeight='100%';frameEl.style.flex='1 1 auto';frameEl.style.alignSelf='stretch';let el=parent;let targetH=0;const collapsed=[];while(el&&el!==doc.body&&el!==doc.documentElement){const h=el.getBoundingClientRect().height;if(h>160){targetH=h;break;}collapsed.push(el);el=el.parentElement;}if(!targetH&&win){targetH=win.innerHeight||doc.documentElement.clientHeight||0;}const fr=frameEl.getBoundingClientRect();if(targetH>160&&fr.height<targetH-1){const hPx=Math.round(targetH);frameEl.setAttribute('height',String(hPx));collapsed.forEach(c=>{if(c.getBoundingClientRect().height<=160){c.style.width='100%';c.style.height='100%';c.style.minHeight=hPx+'px';}});if(frameEl.getBoundingClientRect().height<targetH-1){frameEl.style.height=hPx+'px';frameEl.style.minHeight=hPx+'px';}}}else{const w=frameEl.getBoundingClientRect().width||(parent&&parent.getBoundingClientRect().width)||960;const hPx=Math.max(120,Math.round(w*(activeRatio.rh/activeRatio.rw)));frameEl.setAttribute('height',String(hPx));frameEl.style.aspectRatio=activeRatio.rw+' / '+activeRatio.rh;frameEl.style.height=hPx+'px';frameEl.style.minHeight=hPx+'px';if(parent&&parent.getBoundingClientRect().height<=160){parent.style.width='100%';parent.style.minHeight=hPx+'px';}}};syncFrame();if(typeof ResizeObserver!=='undefined'){const ro=new ResizeObserver(syncFrame);ro.observe(frameEl);let el=frameEl.parentElement;while(el&&el!==doc.documentElement){ro.observe(el);el=el.parentElement;}}if(typeof MutationObserver!=='undefined'){const mo=new MutationObserver(syncFrame);const obsOpts={attributes:true,attributeFilter:['style','class','data-aspect-ratio','data-ratio','aspect-ratio']};mo.observe(frameEl,obsOpts);if(frameEl.parentElement)mo.observe(frameEl.parentElement,obsOpts);}if(win)win.addEventListener('resize',syncFrame);}}catch{}const darkScheme=window.matchMedia('(prefers-color-scheme: dark)');const renderers=[];const applyTheme=mode=>{settings.colorMode=mode==='light'?'light':mode==='neutral'?'neutral':'dark';document.documentElement.dataset.theme=settings.colorMode;renderers.forEach(fn=>fn());};if(settings.themeBehavior==='dark'||settings.themeBehavior==='light'||settings.themeBehavior==='neutral'){applyTheme(settings.themeBehavior);}else{applyTheme(darkScheme.matches?'dark':'light');darkScheme.addEventListener('change',e=>{if(settings.themeBehavior==='auto'){applyTheme(e.matches?'dark':'light');}});}if(window.parent&&window.parent!==window){let inited=false;let polls=0;let lastPostedW=0;const computeTargetHeight=d=>{if(d&&(d.aspectRatio||d.ratio)){const p=parseRatio(d.aspectRatio||d.ratio,baseParsed.rw,baseParsed.rh);if(p)activeRatio=p;}if(activeRatio.mode==='original'){if(d&&typeof d.height==='number'&&d.height>0){return Math.round(d.height);}return Math.max(window.innerHeight>200?window.innerHeight:0,(window.screen&&window.screen.availHeight)||0,960);}const w=(d&&typeof d.width==='number'&&d.width>0?d.width:0)||window.innerWidth||document.documentElement.clientWidth||960;lastPostedW=w;return Math.round(w*(activeRatio.rh/activeRatio.rw));};const postHeight=h=>{const n=Number(h);if(Number.isFinite(n)&&n>0){try{window.parent.postMessage({type:'height',height:Math.round(n),aspectRatio:activeRatio.mode==='original'?'original':activeRatio.rw+':'+activeRatio.rh,ratio:activeRatio.mode==='original'?'original':activeRatio.rw+':'+activeRatio.rh},'*');}catch{}}};const pollInit=()=>{if(inited||polls++>50)return;try{window.parent.postMessage({type:'init'},'*');}catch{}setTimeout(pollInit,100);};window.addEventListener('message',e=>{const d=e.data;if(!d||typeof d!=='object')return;if(d.type==='init'||d.type==='resize'||d.type==='aspectRatio'||d.type==='ratio'){inited=true;const nextH=computeTargetHeight(d);if(activeRatio.mode!=='original'||(typeof d.height==='number'&&d.height>0)){postHeight(nextH);}if(settings.themeBehavior==='auto'&&(d.mode==='dark'||d.mode==='light')){applyTheme(d.mode);}}else if(d.type==='mode'&&settings.themeBehavior==='auto'&&(d.mode==='dark'||d.mode==='light')){applyTheme(d.mode);}});if(!sameOriginManaged||window.innerHeight<=160){postHeight(computeTargetHeight());}pollInit();window.addEventListener('resize',()=>{if(activeRatio.mode!=='locked')return;const w=window.innerWidth||document.documentElement.clientWidth||0;if((!sameOriginManaged||inited)&&w>0&&Math.abs(w-lastPostedW)>1){postHeight(computeTargetHeight());}});window.addEventListener('load',()=>{if(!sameOriginManaged||window.innerHeight<=160){postHeight(computeTargetHeight());}try{window.parent.postMessage({type:'init'},'*');}catch{}},{once:true});}document.querySelectorAll('[data-spark-scene]').forEach(host=>{const canvas=host.querySelector('canvas');if(!canvas)return;const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');let renderer;let visible=true;let last=0;let time=settings.posterTime||0;let failed=false;let ready=false;try{renderer=new window.SparkRenderer(canvas,{glyph:settings.glyph,noise:settings.noise,motifSvg:settings.motifSvg,customGlyph1Url:settings.customGlyph1Url,customGlyph2Url:settings.customGlyph2Url});}catch{return;}let rafId=0;let needsResize=true;const wake=()=>{if(!rafId&&ready&&!failed&&visible&&!document.hidden&&!reduced.matches){last=0;rafId=requestAnimationFrame(frame);}};const cursorInteraction=new window.SparkPointerInteraction(host,()=>!reduced.matches&&visible&&!document.hidden,wake);const renderStill=()=>{if(ready&&!failed){try{renderer.render(settings,time,{});host.classList.add('is-ready');}catch{}}};renderers.push(renderStill);const onStateChange=()=>{if(document.hidden||reduced.matches||!visible){cursorInteraction.reset();if(rafId){cancelAnimationFrame(rafId);rafId=0;}last=0;if(reduced.matches)renderStill();}else{wake();}};reduced.addEventListener('change',onStateChange);document.addEventListener('visibilitychange',onStateChange);const resize=()=>{needsResize=false;const r=host.getBoundingClientRect();const scale=Math.min(window.devicePixelRatio||1,2);const cssW=Math.max(r.width,window.innerWidth||0,document.documentElement.clientWidth||0);const cssH=Math.max(r.height,window.innerHeight||0,document.documentElement.clientHeight||0);const w=Math.max(2,Math.round(cssW*scale));const h=Math.max(2,Math.round(cssH*scale));if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;renderStill();}};const markResize=()=>{needsResize=true;if(!rafId)resize();};const observer=new ResizeObserver(markResize);observer.observe(host);observer.observe(document.documentElement);window.addEventListener('resize',markResize);window.addEventListener('load',markResize);resize();const visibility=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;onStateChange();});visibility.observe(host);function frame(now){rafId=0;if(!host.isConnected){observer.disconnect();visibility.disconnect();window.removeEventListener('resize',markResize);window.removeEventListener('load',markResize);cursorInteraction.destroy();reduced.removeEventListener('change',onStateChange);document.removeEventListener('visibilitychange',onStateChange);renderer.destroy();return;}if(failed||!visible||document.hidden||reduced.matches){last=0;return;}if(needsResize){resize();}const active=cursorInteraction.isActive?cursorInteraction.isActive(now,settings):true;const minFrameMs=active?15.8:21.5;if(last&&now-last<minFrameMs){rafId=requestAnimationFrame(frame);return;}const dt=last?Math.min((now-last)/1000,0.1):0;last=now;time=(time+dt)%settings.duration;try{renderer.render(settings,time,cursorInteraction.sample(dt,now,settings));host.classList.add('is-ready');}catch{failed=true;host.classList.remove('is-ready');return;}rafId=requestAnimationFrame(frame);}canvas.addEventListener('webglcontextlost',()=>{failed=true;host.classList.remove('is-ready');});renderer.ready.then(()=>{ready=true;resize();renderStill();wake();}).catch(()=>{});});})();