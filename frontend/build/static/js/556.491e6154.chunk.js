"use strict";(self.webpackChunkbcusermanagement=self.webpackChunkbcusermanagement||[]).push([[556],{7131:(e,a,t)=>{t.d(a,{A:()=>o});var r=t(4449),l=(t(5043),t(7353)),s=t(579);const n={position:"absolute",top:"50%",left:"50%",transform:"translate(-50%, -50%)",bgcolor:"background.paper",boxShadow:24,p:4,borderRadius:"1rem"},o=e=>{let{open:a,handleClose:t,children:o}=e;return(0,s.jsx)(r.A,{open:a,onClose:t,"aria-labelledby":"modal-modal-title","aria-describedby":"modal-modal-description",children:(0,s.jsx)(l.A,{sx:n,children:o})})}},2549:(e,a,t)=>{t.d(a,{A:()=>i});t(5043);var r=t(3519),l=t(2201),s=t(8155),n=t(579);const o=()=>(0,n.jsx)(l.A,{expand:"lg",className:"bg-body-tertiary",children:(0,n.jsxs)(r.A,{children:[(0,n.jsx)(l.A.Brand,{href:"#home",children:"Bulls Catch"}),(0,n.jsx)(l.A.Toggle,{"aria-controls":"basic-navbar-nav"}),(0,n.jsx)("div",{className:"d-flex",children:(0,n.jsx)(s.A,{variant:"outline-danger",onClick:()=>{localStorage.removeItem("token"),window.location.href="/"},children:"Logout"})})]})}),i=e=>{let{children:a}=e;return(0,n.jsxs)("div",{className:"layout-main",children:[(0,n.jsx)(o,{}),(0,n.jsx)("div",{className:"flex flex-1 p-4",children:a})]})}},8556:(e,a,t)=>{t.r(a),t.d(a,{default:()=>I});var r=t(9379),l=t(5043),s=t(2549),n=t(3892),o=t(899),i=t(4974),c=t(2235),d=t(6510),u=t(5191),p=t(652),h=t(3453),m=t(4670),b=t(5865),g=t(7561),x=t(9190),v=t(2268),A=t(8988),y=t(7784),j=t(1906),f=t(7131),C=t(7488),k=t(4957),w=t(579);const I=()=>{const[e,a]=(0,l.useState)([]),[t,I]=(0,l.useState)([]),[V,S]=(0,l.useState)([]),[N,B]=(0,l.useState)([]),[D,M]=(0,l.useState)(1),[q,T]=(0,l.useState)(!1),R=localStorage.getItem("token"),O=async()=>{const e=await k.A.get("/getTrade",{headers:{Authorization:"bearer ".concat(R)}});200===e.status&&a(e.data)};(0,l.useEffect)((()=>{O(),(async()=>{try{const e=await k.A.get("/getAllBroker?status=1");I(e.data.data);let a=e.data.data.map(((e,a,t)=>t.findIndex((a=>a.brokerName===e.brokerName))===a?e.brokerName:null)).filter((e=>null!==e));B(a)}catch(e){console.log(e)}})()}),[R]);const L=Math.ceil(e.length/4),W=l.useMemo((()=>{const a=4*(D-1),t=a+4;return e.slice(a,t)}),[D,e]),G=()=>{T(!1)},P=o.Ik().shape({broker:o.Yj().required("Broker is required"),tradeId:o.Yj().required("ID is required"),strategy:o.Yj().required("Strategy is required"),counter:o.ai().required("Counter is required").positive("Must be positive"),buyValue:o.ai().required("Buy Value is required").positive("Must be positive"),sellValue:o.ai().required("Sell Value is required"),dealer:o.Yj().required("Dealer is required"),pl:o.Yj().required("P/L is required")}),z={Date:new Date,broker:"",tradeId:null,strategy:"",counter:"",buyValue:"",sellValue:"",dealer:"",pl:""};return(0,w.jsxs)(s.A,{children:[(0,w.jsxs)(f.A,{open:q,handleClose:G,children:[(0,w.jsx)(b.A,{variant:"h6",className:"mb-2",children:"Add Data"}),(0,w.jsx)(n.l1,{initialValues:z,validationSchema:P,onSubmit:async e=>{const a=(0,r.A)((0,r.A)({},e),{},{Date:e.Date?(t=e.Date,new Date(t).toISOString().slice(0,19).replace("T"," ")):null});var t;200===(await k.A.post("/create_trade",a,{headers:{Authorization:"bearer ".concat(R)}})).status&&(O(),C.oR.success("Data added successfully"),G())},children:e=>{let{values:a,errors:r,touched:l,setFieldValue:s}=e;return(0,w.jsxs)(n.lV,{children:[(0,w.jsxs)("div",{className:"flex gap-3 mb-3",children:[(0,w.jsxs)(g.A,{fullWidth:!0,children:[(0,w.jsx)(x.A,{children:"Broker"}),(0,w.jsx)(v.A,{name:"broker",value:a.broker,label:"Broker",onChange:e=>{const a=e.target.value;s("broker",a),S(t.filter((e=>e.brokerName===a)).map((e=>e.brokerId)))},error:l.broker&&Boolean(r.broker),children:N.map(((e,a)=>(0,w.jsx)(A.A,{value:e,children:e},a)))})]}),(0,w.jsxs)(g.A,{fullWidth:!0,children:[(0,w.jsx)(x.A,{children:"ID"}),(0,w.jsx)(v.A,{name:"tradeId",label:"Id",value:a.tradeId,onChange:e=>s("tradeId",e.target.value),error:l.tradeId&&Boolean(r.tradeId),children:V.map(((e,a)=>(0,w.jsx)(A.A,{value:e,children:e},a)))})]})]}),(0,w.jsxs)("div",{className:"flex gap-2 mb-3",children:[(0,w.jsx)(y.A,{fullWidth:!0,name:"dealer",label:"Dealer",value:a.dealer,onChange:e=>s("dealer",e.target.value),error:l.dealer&&Boolean(r.dealer),helperText:l.dealer&&r.dealer}),(0,w.jsxs)(g.A,{fullWidth:!0,children:[(0,w.jsx)(x.A,{children:"Strategy"}),(0,w.jsx)(v.A,{name:"strategy",label:"Strategy",value:a.strategy,onChange:e=>s("strategy",e.target.value),error:l.strategy&&Boolean(r.strategy),children:(0,w.jsx)(A.A,{value:"Strategy 1",children:"Strategy 1"})})]}),(0,w.jsx)(y.A,{fullWidth:!0,name:"counter",label:"Counter",value:a.counter,onChange:e=>s("counter",e.target.value),error:l.counter&&Boolean(r.counter),helperText:l.counter&&r.counter})]}),(0,w.jsxs)("div",{className:"flex gap-3 mb-3",children:[(0,w.jsx)(y.A,{fullWidth:!0,name:"buyValue",label:"Buy Value",value:a.buyValue,onChange:e=>s("buyValue",e.target.value),error:l.buyValue&&Boolean(r.buyValue),helperText:l.buyValue&&r.buyValue}),(0,w.jsx)(y.A,{fullWidth:!0,name:"sellValue",label:"Sell Value",value:a.sellValue,onChange:e=>s("sellValue",e.target.value),error:l.sellValue&&Boolean(r.sellValue),helperText:l.sellValue&&r.sellValue}),(0,w.jsx)(y.A,{fullWidth:!0,name:"pl",label:"P/L",value:a.pl,onChange:e=>s("pl",e.target.value),error:l.pl&&Boolean(r.pl),helperText:l.pl&&r.pl})]}),(0,w.jsxs)("div",{className:"flex justify-end gap-3",children:[(0,w.jsx)(j.A,{variant:"contained",type:"submit",children:"Submit Data"}),(0,w.jsx)(j.A,{variant:"outlined",onClick:G,children:"Cancel"})]})]})}})]}),(0,w.jsxs)("div",{className:"w-full",children:[(0,w.jsxs)("div",{className:"flex justify-between",children:[(0,w.jsx)(b.A,{variant:"h5",className:"mb-3",children:"Data Management"}),(0,w.jsx)(j.A,{variant:"contained mb-3",onClick:()=>T(!0),children:"Submit Data"})]}),(0,w.jsxs)(i.j,{"aria-label":"Example table with client-side pagination",bottomContent:(0,w.jsx)("div",{className:"flex w-full justify-center",children:(0,w.jsx)(c.T,{isCompact:!0,showControls:!0,showShadow:!0,color:"secondary",page:D,total:L,onChange:e=>M(e)})}),children:[(0,w.jsxs)(d.X,{children:[(0,w.jsx)(u.e,{children:"Broker Name"}),(0,w.jsx)(u.e,{children:"Trade ID"}),(0,w.jsx)(u.e,{children:"Dealer"}),(0,w.jsx)(u.e,{children:"Buy Value"}),(0,w.jsx)(u.e,{children:"Sell Value"}),(0,w.jsx)(u.e,{children:"Strategy"})]}),(0,w.jsx)(p.E,{children:W.map(((e,a)=>(0,w.jsxs)(h.s,{children:[(0,w.jsx)(m.w,{children:e.brokerName}),(0,w.jsx)(m.w,{children:e.tradeId}),(0,w.jsx)(m.w,{children:e.dealer}),(0,w.jsx)(m.w,{children:e.buyValue}),(0,w.jsx)(m.w,{children:e.sellValue}),(0,w.jsx)(m.w,{children:e.strategy})]},a)))})]})]})]})}},4957:(e,a,t)=>{t.d(a,{A:()=>l});const r=t(9722).A.create({baseURL:"http://43.204.150.47:8000",timeout:5e3});r.interceptors.request.use((e=>(e.headers.Authorization="Bearer ".concat(localStorage.getItem("token")),e)),(e=>(console.error("Request Interceptor Error:",e),Promise.reject(e)))),r.interceptors.response.use((e=>(console.log("Response Interceptor: Response received"),e)),(e=>(e.response&&401===e.response.status?console.error("Response Interceptor: Unauthorized access - Redirecting to login"):console.error("Response Interceptor Error:",e.message),Promise.reject(e))));const l=r},7353:(e,a,t)=>{t.d(a,{A:()=>A});var r=t(9379),l=t(45),s=t(5043),n=t(8387),o=t(4984),i=t(8812),c=t(8698),d=t(3693),u=t(579);const p=["className","component"];var h=t(9386),m=t(6623),b=t(3375);const g=(0,t(2532).A)("MuiBox",["root"]),x=(0,m.A)(),v=function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};const{themeId:a,defaultTheme:t,defaultClassName:h="MuiBox-root",generateClassName:m}=e,b=(0,o.Ay)("div",{shouldForwardProp:e=>"theme"!==e&&"sx"!==e&&"as"!==e})(i.A);return s.forwardRef((function(e,s){const o=(0,d.A)(t),i=(0,c.A)(e),{className:g,component:x="div"}=i,v=(0,l.A)(i,p);return(0,u.jsx)(b,(0,r.A)({as:x,ref:s,className:(0,n.A)(g,m?m(h):h),theme:a&&o[a]||o},v))}))}({themeId:b.A,defaultTheme:x,defaultClassName:g.root,generateClassName:h.A.generate}),A=v},8988:(e,a,t)=>{t.d(a,{A:()=>V});var r=t(45),l=t(9379),s=t(5043),n=t(8387),o=t(8610),i=t(1546),c=t(1475),d=t(2108),u=t(6262),p=t(6431),h=t(1347),m=t(2790),b=t(5013),g=t(5849),x=t(2532);const v=(0,x.A)("MuiDivider",["root","absolute","fullWidth","inset","middle","flexItem","light","vertical","withChildren","withChildrenVertical","textAlignRight","textAlignLeft","wrapper","wrapperVertical"]);const A=(0,x.A)("MuiListItemIcon",["root","alignItemsFlexStart"]);const y=(0,x.A)("MuiListItemText",["root","multiline","dense","inset","primary","secondary"]);var j=t(2372);function f(e){return(0,j.Ay)("MuiMenuItem",e)}const C=(0,x.A)("MuiMenuItem",["root","focusVisible","dense","disabled","divider","gutters","selected"]);var k=t(579);const w=["autoFocus","component","dense","divider","disableGutters","focusVisibleClassName","role","tabIndex","className"],I=(0,d.Ay)(m.A,{shouldForwardProp:e=>(0,c.A)(e)||"classes"===e,name:"MuiMenuItem",slot:"Root",overridesResolver:(e,a)=>{const{ownerState:t}=e;return[a.root,t.dense&&a.dense,t.divider&&a.divider,!t.disableGutters&&a.gutters]}})((0,u.A)((e=>{let{theme:a}=e;return(0,l.A)((0,l.A)({},a.typography.body1),{},{display:"flex",justifyContent:"flex-start",alignItems:"center",position:"relative",textDecoration:"none",minHeight:48,paddingTop:6,paddingBottom:6,boxSizing:"border-box",whiteSpace:"nowrap","&:hover":{textDecoration:"none",backgroundColor:(a.vars||a).palette.action.hover,"@media (hover: none)":{backgroundColor:"transparent"}},["&.".concat(C.selected)]:{backgroundColor:a.vars?"rgba(".concat(a.vars.palette.primary.mainChannel," / ").concat(a.vars.palette.action.selectedOpacity,")"):(0,i.X4)(a.palette.primary.main,a.palette.action.selectedOpacity),["&.".concat(C.focusVisible)]:{backgroundColor:a.vars?"rgba(".concat(a.vars.palette.primary.mainChannel," / calc(").concat(a.vars.palette.action.selectedOpacity," + ").concat(a.vars.palette.action.focusOpacity,"))"):(0,i.X4)(a.palette.primary.main,a.palette.action.selectedOpacity+a.palette.action.focusOpacity)}},["&.".concat(C.selected,":hover")]:{backgroundColor:a.vars?"rgba(".concat(a.vars.palette.primary.mainChannel," / calc(").concat(a.vars.palette.action.selectedOpacity," + ").concat(a.vars.palette.action.hoverOpacity,"))"):(0,i.X4)(a.palette.primary.main,a.palette.action.selectedOpacity+a.palette.action.hoverOpacity),"@media (hover: none)":{backgroundColor:a.vars?"rgba(".concat(a.vars.palette.primary.mainChannel," / ").concat(a.vars.palette.action.selectedOpacity,")"):(0,i.X4)(a.palette.primary.main,a.palette.action.selectedOpacity)}},["&.".concat(C.focusVisible)]:{backgroundColor:(a.vars||a).palette.action.focus},["&.".concat(C.disabled)]:{opacity:(a.vars||a).palette.action.disabledOpacity},["& + .".concat(v.root)]:{marginTop:a.spacing(1),marginBottom:a.spacing(1)},["& + .".concat(v.inset)]:{marginLeft:52},["& .".concat(y.root)]:{marginTop:0,marginBottom:0},["& .".concat(y.inset)]:{paddingLeft:36},["& .".concat(A.root)]:{minWidth:36},variants:[{props:e=>{let{ownerState:a}=e;return!a.disableGutters},style:{paddingLeft:16,paddingRight:16}},{props:e=>{let{ownerState:a}=e;return a.divider},style:{borderBottom:"1px solid ".concat((a.vars||a).palette.divider),backgroundClip:"padding-box"}},{props:e=>{let{ownerState:a}=e;return!a.dense},style:{[a.breakpoints.up("sm")]:{minHeight:"auto"}}},{props:e=>{let{ownerState:a}=e;return a.dense},style:(0,l.A)((0,l.A)({minHeight:32,paddingTop:4,paddingBottom:4},a.typography.body2),{},{["& .".concat(A.root," svg")]:{fontSize:"1.25rem"}})}]})}))),V=s.forwardRef((function(e,a){const t=(0,p.b)({props:e,name:"MuiMenuItem"}),{autoFocus:i=!1,component:c="li",dense:d=!1,divider:u=!1,disableGutters:m=!1,focusVisibleClassName:x,role:v="menuitem",tabIndex:A,className:y}=t,j=(0,r.A)(t,w),C=s.useContext(h.A),V=s.useMemo((()=>({dense:d||C.dense||!1,disableGutters:m})),[C.dense,d,m]),S=s.useRef(null);(0,b.A)((()=>{i&&S.current&&S.current.focus()}),[i]);const N=(0,l.A)((0,l.A)({},t),{},{dense:V.dense,divider:u,disableGutters:m}),B=(e=>{const{disabled:a,dense:t,divider:r,disableGutters:s,selected:n,classes:i}=e,c={root:["root",t&&"dense",a&&"disabled",!s&&"gutters",r&&"divider",n&&"selected"]},d=(0,o.A)(c,f,i);return(0,l.A)((0,l.A)({},i),d)})(t),D=(0,g.A)(S,a);let M;return t.disabled||(M=void 0!==A?A:-1),(0,k.jsx)(h.A.Provider,{value:V,children:(0,k.jsx)(I,(0,l.A)((0,l.A)({ref:D,role:v,tabIndex:M,component:c,focusVisibleClassName:(0,n.A)(B.focusVisible,x),className:(0,n.A)(B.root,y)},j),{},{ownerState:N,classes:B}))})}))}}]);
//# sourceMappingURL=556.491e6154.chunk.js.map