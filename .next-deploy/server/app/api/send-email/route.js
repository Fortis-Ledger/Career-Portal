(()=>{var e={};e.id=2607,e.ids=[2607],e.modules={3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},10017:(e,t,r)=>{"use strict";r.r(t),r.d(t,{patchFetch:()=>y,routeModule:()=>f,serverHooks:()=>x,workAsyncStorage:()=>m,workUnitAsyncStorage:()=>h});var i={};r.r(i),r.d(i,{POST:()=>g});var a=r(36044),o=r(63409),s=r(9576),n=r(10949),p=r(54686);async function l(e){try{let t=await (0,p.U)(),{data:r,error:i}=await t.from("portal_settings").select("smtp_host, smtp_port, smtp_username, smtp_password, email_notifications, contact_email").single();if(i)throw console.error("Database error fetching settings:",i),Error(`Database error: ${i.message}`);if(!r)throw Error("Portal settings not found. Please run the setup SQL script.");if(!r?.email_notifications)return console.log("Email notifications are disabled"),!1;if(process.env.RESEND_API_KEY&&(console.log("Attempting to send via Resend API..."),await c(e)))return!0;if(r?.smtp_host&&r?.smtp_username&&r?.smtp_password)return console.log("Attempting to send via SMTP..."),await d(r,e);throw Error("No email configuration found. Please configure SMTP settings in admin portal.")}catch(e){throw console.error("Email send error:",e),e}}async function c(e){try{let t=await fetch("https://api.resend.com/emails",{method:"POST",headers:{Authorization:`Bearer ${process.env.RESEND_API_KEY}`,"Content-Type":"application/json"},body:JSON.stringify({from:e.from||"FortisLedger Career <noreply@career.fortisledger.io>",to:[e.to],subject:e.subject,html:e.html})});if(!t.ok)return console.error("Resend API failed:",await t.text()),!1;return!0}catch(e){return console.error("Email send error:",e),!1}}async function d(e,t){try{let i=(await r.e(8474).then(r.t.bind(r,68474,19))).createTransport({host:e.smtp_host,port:parseInt(e.smtp_port),secure:465===parseInt(e.smtp_port),auth:{user:e.smtp_username,pass:e.smtp_password}});return await i.sendMail({from:t.from||`FortisLedger Career <${e.smtp_username}>`,to:t.to,subject:t.subject,html:t.html}),!0}catch(e){return console.error("SMTP send error:",e),!1}}let u={applicationReceived:(e,t,r)=>({subject:`Application Received - ${t}`,html:`
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 0;">
        <div style="background: white; margin: 20px; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
          <div style="background: linear-gradient(135deg, #0ea5e9 0%, #8b5cf6 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">FortisLedger</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0 0; font-size: 16px;">Career Portal</p>
          </div>
          <div style="padding: 40px 30px;">
            <h2 style="color: #1e293b; margin: 0 0 20px 0; font-size: 24px;">Application Received</h2>
            <p style="color: #334155; font-size: 16px; line-height: 1.6;">Dear ${e},</p>
            <div style="background: #f8fafc; padding: 25px; border-radius: 8px; border-left: 4px solid #10b981; margin: 20px 0;">
              <p style="color: #334155; margin: 0; font-size: 16px; line-height: 1.6;">
                Thank you for your application for the <strong>${t}</strong> position at <strong>${r}</strong>.
              </p>
              <p style="color: #334155; margin: 15px 0 0 0; font-size: 16px; line-height: 1.6;">
                We have received your application and our team will review it shortly. You will hear from us within the next few days.
              </p>
            </div>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
              <p style="color: #64748b; margin: 0; font-size: 14px;">
                Best regards,<br>
                <strong style="color: #1e293b;">The ${r} Team</strong>
              </p>
            </div>
          </div>
          <div style="background: #f1f5f9; padding: 20px 30px; text-align: center;">
            <p style="color: #64748b; margin: 0; font-size: 12px;">
              \xa9 2025 FortisLedger. All rights reserved.<br>
              <a href="https://career.fortisledger.io" style="color: #0ea5e9; text-decoration: none;">career.fortisledger.io</a>
            </p>
          </div>
        </div>
      </div>
    `}),applicationStatusUpdate:(e,t,r,i)=>({subject:`Application Update - ${t}`,html:`
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0ea5e9;">Application Status Update</h2>
        <p>Dear ${e},</p>
        <p>Your application for the <strong>${t}</strong> position has been updated.</p>
        <p><strong>New Status:</strong> ${r.charAt(0).toUpperCase()+r.slice(1)}</p>
        ${"interview"===r?"<p>We will contact you soon with interview details.</p>":""}
        ${"offer"===r?"<p>Congratulations! We will be in touch with offer details.</p>":""}
        <p>Best regards,<br>The ${i} Team</p>
      </div>
    `}),newApplicationNotification:(e,t,r)=>({subject:`New Application - ${t}`,html:`
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0ea5e9;">New Application Received</h2>
        <p>A new application has been submitted:</p>
        <ul>
          <li><strong>Applicant:</strong> ${e}</li>
          <li><strong>Position:</strong> ${t}</li>
          <li><strong>Company:</strong> ${r}</li>
        </ul>
        <p>Please review the application in the admin dashboard.</p>
      </div>
    `})};async function g(e){try{let t;let r=await (0,p.U)(),{data:{user:i},error:a}=await r.auth.getUser();if(a||!i)return n.NextResponse.json({error:"Unauthorized"},{status:401});let{type:o,data:s}=await e.json();switch(o){case"application_received":t={to:s.applicantEmail,...u.applicationReceived(s.applicantName,s.jobTitle,s.companyName)};break;case"application_status_update":t={to:s.applicantEmail,...u.applicationStatusUpdate(s.applicantName,s.jobTitle,s.status,s.companyName)};break;case"new_application_notification":let{data:c}=await r.from("portal_settings").select("notification_email").single();t={to:c?.notification_email||"admin@fortisledger.io",...u.newApplicationNotification(s.applicantName,s.jobTitle,s.companyName)};break;case"custom":t={to:s.to||s.applicantEmail,subject:s.subject,html:`
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 0;">
              <div style="background: white; margin: 20px; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
                <div style="background: linear-gradient(135deg, #0ea5e9 0%, #8b5cf6 100%); padding: 30px; text-align: center;">
                  <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">FortisLedger</h1>
                  <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0 0; font-size: 16px;">Career Portal</p>
                </div>
                <div style="padding: 40px 30px;">
                  <h2 style="color: #1e293b; margin: 0 0 20px 0; font-size: 24px;">Hello ${s.applicantName},</h2>
                  <div style="background: #f8fafc; padding: 25px; border-radius: 8px; border-left: 4px solid #0ea5e9; margin: 20px 0;">
                    <div style="color: #334155; font-size: 16px; line-height: 1.6;">
                      ${s.message.replace(/\n/g,"<br>")}
                    </div>
                  </div>
                  <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                    <p style="color: #64748b; margin: 0; font-size: 14px;">
                      Best regards,<br>
                      <strong style="color: #1e293b;">The FortisLedger Team</strong><br>
                      <span style="color: #94a3b8;">Building the future of financial technology</span>
                    </p>
                  </div>
                </div>
                <div style="background: #f1f5f9; padding: 20px 30px; text-align: center;">
                  <p style="color: #64748b; margin: 0; font-size: 12px;">
                    \xa9 2025 FortisLedger. All rights reserved.<br>
                    <a href="https://career.fortisledger.io" style="color: #0ea5e9; text-decoration: none;">career.fortisledger.io</a>
                  </p>
                </div>
              </div>
            </div>
          `,text:`Dear ${s.applicantName},

${s.message}

Best regards,
The FortisLedger Team
Building the future of financial technology

\xa9 2025 FortisLedger. All rights reserved.
career.fortisledger.io`};break;default:return n.NextResponse.json({error:"Invalid email type"},{status:400})}if(await l(t))return n.NextResponse.json({success:!0,message:"Email sent successfully"});return n.NextResponse.json({error:"Failed to send email"},{status:500})}catch(t){console.error("Email API error:",t);let e=t instanceof Error?t.message:"Unknown error";return n.NextResponse.json({error:"Internal server error",details:e,debug:void 0},{status:500})}}let f=new a.AppRouteRouteModule({definition:{kind:o.RouteKind.APP_ROUTE,page:"/api/send-email/route",pathname:"/api/send-email",filename:"route",bundlePath:"app/api/send-email/route"},resolvedPagePath:"F:\\fortisledger\\app\\api\\send-email\\route.ts",nextConfigOutput:"",userland:i}),{workAsyncStorage:m,workUnitAsyncStorage:h,serverHooks:x}=f;function y(){return(0,s.patchFetch)({workAsyncStorage:m,workUnitAsyncStorage:h})}},10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},11997:e=>{"use strict";e.exports=require("punycode")},14985:e=>{"use strict";e.exports=require("dns")},21820:e=>{"use strict";e.exports=require("os")},27910:e=>{"use strict";e.exports=require("stream")},28354:e=>{"use strict";e.exports=require("util")},29021:e=>{"use strict";e.exports=require("fs")},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},30496:()=>{},33873:e=>{"use strict";e.exports=require("path")},34631:e=>{"use strict";e.exports=require("tls")},43648:()=>{},44870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},50823:(e,t,r)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"createDedupedByCallsiteServerErrorLoggerDev",{enumerable:!0,get:function(){return p}});let i=function(e,t){if(e&&e.__esModule)return e;if(null===e||"object"!=typeof e&&"function"!=typeof e)return{default:e};var r=a(t);if(r&&r.has(e))return r.get(e);var i={__proto__:null},o=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var s in e)if("default"!==s&&Object.prototype.hasOwnProperty.call(e,s)){var n=o?Object.getOwnPropertyDescriptor(e,s):null;n&&(n.get||n.set)?Object.defineProperty(i,s,n):i[s]=e[s]}return i.default=e,r&&r.set(e,i),i}(r(83263));function a(e){if("function"!=typeof WeakMap)return null;var t=new WeakMap,r=new WeakMap;return(a=function(e){return e?r:t})(e)}let o={current:null},s="function"==typeof i.cache?i.cache:e=>e,n=console.warn;function p(e){return function(...t){n(e(...t))}}s(e=>{try{n(o.current)}finally{o.current=null}})},54686:(e,t,r)=>{"use strict";r.d(t,{R:()=>s,U:()=>o});var i=r(51375),a=r(15886);async function o(){let e=await (0,a.UL)();return(0,i.createServerClient)("https://samxmwiyhkencakujwgb.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNhbXhtd2l5aGtlbmNha3Vqd2diIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4MjkxNTcsImV4cCI6MjA3MjQwNTE1N30.S5tFj2ObP3N12jXTI-FSS9tWCmIRAH7VgLmSB2Hz8dg",{cookies:{getAll:()=>e.getAll(),setAll(t){try{t.forEach(({name:t,value:r,options:i})=>e.set(t,r,i))}catch{}}}})}async function s(){return await o()}},55511:e=>{"use strict";e.exports=require("crypto")},55591:e=>{"use strict";e.exports=require("https")},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},74075:e=>{"use strict";e.exports=require("zlib")},79551:e=>{"use strict";e.exports=require("url")},79646:e=>{"use strict";e.exports=require("child_process")},81630:e=>{"use strict";e.exports=require("http")},91645:e=>{"use strict";e.exports=require("net")},94735:e=>{"use strict";e.exports=require("events")}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),i=t.X(0,[7095,2410,1292,2920],()=>r(10017));module.exports=i})();