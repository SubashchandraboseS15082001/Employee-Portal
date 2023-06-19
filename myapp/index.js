const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const port = 5000;
const axios = require("axios");
const { parseString } = require("xml2js");
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";

app.use(bodyParser.json());
app.use(cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-with,Content-Type,Accept"
  );
  next();
});
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// ########################################### LOGIN BACKEND #####################################

app.post("/login", async (req, res) => {
  try {
    var username = req.body.empid;
    var password = req.body.password;
    console.log(req.body);
    const url =
      "http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_SCB_EMP_LOGIN&receiverParty=&receiverService=&interface=SI_SCB_EMP_LOGIN&interfaceNamespace=http://subash.com/employee_login";
    var reqData = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:rfc:functions">
    <soapenv:Header/>
    <soapenv:Body>
       <urn:ZFM_EMP_LOGIN>
          <!--You may enter the following 2 items in any order-->
          <IM_EMP_ID>${username}</IM_EMP_ID>
          <IM_PASSWORD>${password}</IM_PASSWORD>
       </urn:ZFM_EMP_LOGIN>
    </soapenv:Body>
 </soapenv:Envelope>`;
    pipo_res = axios({
      url: url,
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "include",
      headers: {
        Authorization: "Basic cG91c2VyQDE6MjAyMkBUZWNo",
        "Content-Type": "application/xml",
      },
      data: reqData,
    }).then((r) => {
      var xmlData = r.data;
      parseString(xmlData, function (err, result) {
        var jsonData = result;

        var status =
          jsonData["SOAP:Envelope"]["SOAP:Body"][0][
            "ns0:ZFM_EMP_LOGIN.Response"
          ][0]["E_RESULT"][0];
        var name =
          jsonData["SOAP:Envelope"]["SOAP:Body"][0][
            "ns0:ZFM_EMP_LOGIN.Response"
          ][0]["E_NAME"][0];
        // console.log(status);
        res.send({ status: status, name: name });
      });
    });
  } catch (error) {
    res.send(error);
  }
});

// ########################################### Employee Prof ######################################

app.post("/userprofile", async (req, res) => {
  try {
    var username = req.body.emp;
    const url =
      "https://dxbktlds4.kaarcloud.com:4300/sap/bc/srt/rfc/sap/zws_emp_profile/100/zws_emp_profile/zws_emp_profile";
    var reqData = `<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:urn="urn:sap-com:document:sap:rfc:functions">
    <soap:Header/>
    <soap:Body>
       <urn:ZFM_EMP_PROFILE>
          <EMPID>8</EMPID>
       </urn:ZFM_EMP_PROFILE>
    </soap:Body>
 </soap:Envelope>`;
    pipo_res = axios({
      url: url,
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "include",
      headers: {
        Authorization: "Basic QUJBUEVSMzpBYmFwZXJAMTIz",
        "Content-Type": "application/soap+xml",
      },
      data: reqData,
    }).then((response) => {
      var xmlData = response.data;
      parseString(xmlData, function (err, result) {
        var empId =
          result["env:Envelope"]["env:Body"][0][
            "n0:ZFM_EMP_PROFILEResponse"
          ][0]["EMP_DATA"][0]["PERNR"][0];
        var empName =
          result["env:Envelope"]["env:Body"][0][
            "n0:ZFM_EMP_PROFILEResponse"
          ][0]["EMP_DATA"][0]["ENAME"][0];
        var empName =
          result["env:Envelope"]["env:Body"][0][
            "n0:ZFM_EMP_PROFILEResponse"
          ][0]["EMP_DATA"][0]["ENAME"][0];
        var location =
          result["env:Envelope"]["env:Body"][0][
            "n0:ZFM_EMP_PROFILEResponse"
          ][0]["EMP_DATA"][0]["ORT01"][0];
        var nationality =
          result["env:Envelope"]["env:Body"][0][
            "n0:ZFM_EMP_PROFILEResponse"
          ][0]["EMP_DATA"][0]["LAND"][0];
        var begin =
          result["env:Envelope"]["env:Body"][0][
            "n0:ZFM_EMP_PROFILEResponse"
          ][0]["EMP_DATA"][0]["BEGDA"][0];
        var end =
          result["env:Envelope"]["env:Body"][0][
            "n0:ZFM_EMP_PROFILEResponse"
          ][0]["EMP_DATA"][0]["ENDDA"][0];
        var status =
          result["env:Envelope"]["env:Body"][0][
            "n0:ZFM_EMP_PROFILEResponse"
          ][0]["EMP_DATA"][0]["STATUS"][0];
        var DOB =
          result["env:Envelope"]["env:Body"][0][
            "n0:ZFM_EMP_PROFILEResponse"
          ][0]["EMP_DATA"][0]["GBDAT"][0];
        var post =
          result["env:Envelope"]["env:Body"][0][
            "n0:ZFM_EMP_PROFILEResponse"
          ][0]["EMP_DATA"][0]["PSTLZ"][0];
        var emp_data = {
          name: empName,
          id: parseInt(empId, 10),
          location: location,
          nationality: nationality,
          begin: begin,
          end: end,
          status: status,
          dob: DOB,
          post: post,
        };
        // console.log(result);
        res.send(emp_data);
      });
    });
  } catch (error) {
    res.send(error);
  }
});

// ########################################### Employee Leave ####################################

app.post("/empleave", async (req, res) => {
  try {
    var username = req.body.emp;
    const url =
      "http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_SCB_EMP_LEAVE&receiverParty=&receiverService=&interface=SI_SCB_EMP_LEAVE&interfaceNamespace=http://subash.com/employee_leave";
    var reqData = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:rfc:functions">
    <soapenv:Header/>
    <soapenv:Body>
       <urn:ZFM_EMP_LEAVE>
          <IM_EMP_ID>8</IM_EMP_ID>
          <IT_EMPLEAVE>
             <item>
             </item>
          </IT_EMPLEAVE>
       </urn:ZFM_EMP_LEAVE>
    </soapenv:Body>
 </soapenv:Envelope>`;
    pipo_res = axios({
      url: url,
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "include",
      headers: {
        Authorization: "Basic cG91c2VyQDE6MjAyMkBUZWNo",
        "Content-Type": "application/xml",
      },
      data: reqData,
    }).then((response) => {
      var xmlData = response.data;
      parseString(xmlData, function (err, result) {
        var leaveData =
          result["SOAP:Envelope"]["SOAP:Body"][0][
            "ns0:ZFM_EMP_LEAVE.Response"
          ][0]["IT_EMPLEAVE"][0]["item"];

        res.send(leaveData);
      });
    });
  } catch (error) {
    res.send(error);
  }
});

// ######################################## Employee Payroll ######################################

app.post("/emp_pay", async (req, res) => {
  try {
    // var username = req.body.emp;
    const url =
      "https://172.17.19.22:4300/sap/bc/srt/rfc/sap/zws_emp_pay/100/zws_emp_pay/zws_emp_pay";
    var reqData = `<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:urn="urn:sap-com:document:sap:rfc:functions">
    <soap:Header/>
    <soap:Body>
       <urn:ZFM_MY_PORTAL>
          <EMP_ID>8</EMP_ID>
          <IT_EMP_PAY>
             <item>
             </item>
          </IT_EMP_PAY>
          <ST_DATE>2011-07-01</ST_DATE>
       </urn:ZFM_MY_PORTAL>
    </soap:Body>
 </soap:Envelope>`;
    pipo_res = axios({
      url: url,
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "include",
      headers: {
        Authorization: "Basic QUJBUEVSMzpBYmFwZXJAMTIz",
        "Content-Type": "application/soap+xml",
      },
      data: reqData,
    }).then((response) => {
      var xmlData = response.data;
      parseString(xmlData, function (err, result) {
        var pay =
          result["env:Envelope"]["env:Body"][0]["n0:ZFM_MY_PORTALResponse"][0][
            "IT_EMP_PAY"
          ][0]["item"];

        res.send(pay);
      });
    });
  } catch (error) {
    res.send(error);
  }
});

// ######################################## Employee Payroll form #################################

app.post("/pay_form", async (req, res) => {
  try {
    // var username = req.body.emp;
    const url =
      "http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_SCB_PAYROLL&receiverParty=&receiverService=&interface=SI_SCB_PAYROLL&interfaceNamespace=http://subash.com/PAYROLL";
    var reqData = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:rfc:functions">
    <soapenv:Header/>
    <soapenv:Body>
       <urn:ZFM_PAY>
          <IM_EMP_ID>8</IM_EMP_ID>
       </urn:ZFM_PAY>
    </soapenv:Body>
 </soapenv:Envelope>`;
    pipo_res = axios({
      url: url,
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "include",
      headers: {
        Authorization: "Basic cG91c2VyQDE6MjAyMkBUZWNo",
        "Content-Type": "application/xml",
      },
      data: reqData,
    }).then((response) => {
      var xmlData = response.data;
      parseString(xmlData, function (err, result) {
        var base64 =
          result["SOAP:Envelope"]["SOAP:Body"][0]["ns0:ZFM_PAY.Response"][0][
            "EX_PDF"
          ][0];

        // var pay =
        //   result["SOAP:Envelope"]["SOAP:Body"][0]["ns0:ZFM_PAY.Response"][0][
        //     "EX_PDF"
        //   ][0];

        res.send({ base64: base64 });
      });
    });
  } catch (error) {
    res.send(error);
  }
});
