SearchUI演示地址：[http://47.103.133.15:8082/searchui/](http://47.103.133.15:8082/searchui/ "演示地址")
Attivio演示地址：[http://47.103.133.15:17000](http://47.103.133.15:17000 "演示地址")
# 一：新增功能介绍 #
# 项目起源 #
这个项目是由attivio（结构化非结构化文件的高级软件）的检索模板单独提出来，可供研发人员二次开发
# 项目介绍 #
大体是一个node项目，又是webpack项目配合react前端框架；主要是检索attivio结构化非结构化数据得到的所有结构化数据的一个检索平台
# 部署手册 #
提供一个文档："attivio_searchui配置手册.docx"（在此目录中的resource目录下）
大体介绍下：文档中提到的tomcat配置，我已经提供一个配置好的tomcat（resource/apache-tomcat-9.0.0.zip）可供参考；attivio的安装如果看文档没有成功可直接查询官方文档
部署tomcat时候，需要按需修改tomat\searchui\configuration.properties中的配置，关键配置已有注释在resource文件夹下有模板configuration.properties文件
# 新增功能 #
1. 在搜索结果页面添加export按钮如图
	点击export会获得搜索结果，之后会对搜索结果做二次处理，在配置文件中指定特定字段，可拿到特定字段对应的数据集合
 ![](https://raw.githubusercontent.com/JiPingWangPKI/searchui/master/resource/%E9%A1%B5%E9%9D%A2export.jpg)
2. 提示框控件的添加
	提示框模块：rc-notification
	使用方法：
	在frontend文件夹，webpack根目录下执行npm install rc-notification ；安装完成在想要使用此模块页面引入import 'rc-notification/assets/index.less';import Notification from 'rc-notification';初始化notification 对象  let notification = null;Notification.newInstance({}, (n) => { notification = n; });使用方式特别简单，在需要有提示的地方：notification.notice({ content: '查询结果导出中，正在创建新表存入此结果', duration: 3, style: { background: '#d4b5b2' } });
3. 自定义查询模块增加QueryBuilder
	![](https://raw.githubusercontent.com/JiPingWangPKI/searchui/master/resource/QueryBulder1.jpg)
	![](https://raw.githubusercontent.com/JiPingWangPKI/searchui/master/resource/QueryBulder2.jpg)
4. searchui 过滤fields（我们这里的例子是过滤field中有_s的）
	修改配置方法如下图
	![](https://raw.githubusercontent.com/JiPingWangPKI/searchui/master/resource/field_s.jpg)
5. 配置attivio searchui的登录密码

	![](https://raw.githubusercontent.com/JiPingWangPKI/searchui/master/resource/modifyPassword.jpg)
6. Python集成到attivio中
	集成方法：[https://github.com/JiPingWangPKI/searchui/blob/master/resource/attivio%E6%8E%A5%E5%85%A5python%E8%84%9A%E6%9C%AC.docx](https://github.com/JiPingWangPKI/searchui/blob/master/resource/attivio%E6%8E%A5%E5%85%A5python%E8%84%9A%E6%9C%AC.docx "下载attivio集成python文件")
7. Attivio searchui中配置新的defaultSql机制
	增加新的defalutSql机制是指：searchui接受非同源的数据到本地缓存字段defaultSql中，用户可配置是否使用这个defaultSql，使用的话，新的查询语句会根据普通和高级两种方式来拼接
	![](https://raw.githubusercontent.com/JiPingWangPKI/searchui/master/resource/defaultSql.jpg)
8. searchui中添加下载导出的csv文件
	主要添加一个download按钮，并将之前export导出得内容按一定规则下载为csv文件，SearchUISearchPage.js自行看对应代码
9. Searchui查询主页面的LOGO变为Perkinelmer的logo
	替换对应目录下的图片文件，再稍调样式即可




# 二：原始介绍 #
[![Build Status](https://travis-ci.org/attivio/searchui.svg)](https://travis-ci.org/attivio/searchui)

<a href="http://www.attivio.com" target="_blank"><img src="images/attivio-logo.png" alt="Attivio" width="240" border="0" /></a>
## Table of Contents
* [Overview](#overview)
* [Project Organization](#project-organization)
* [What is SUIT?](#what-is-suit)
* [Installation and Deployment](#installation-and-deployment)
* [How Can I Customize the Search UI?](#how-can-i-customize-the-search-ui)
* [Security](#security)
* [Cognitive Search](#cognitive-search)
* [Ask a Question](#ask-a-question)
* [360&deg; View](#360-view)
* [Insights](#insights)
* [How Do I Configure Search UI?](#how-do-i-configure-search-ui)
* [Supported Browsers](#supported-browsers)
* [Contributing](#contributing)

## Overview
The Attivio **Search UI** is an application built on top of Attivio’s Search UI Toolkit, or **SUIT**. The SUIT library is available in a [separate repository](https://github.com/attivio/suit) and via NPM (see below for details).

The Attivio Search UI allows you to search across and view the data in the index of your Attivio, Elasticsearch or Solr installation. You can customize it to suit your needs and can also use it as the basis for creating your own, brand-new search application.

## Project Organization
The Attivio Search UI is a web application written in JavaScript and based on the React project. It runs in the user’s browser. This component is in the [**frontend**](https://github.com/attivio/searchui/tree/master/frontend) directory of this repository and consists of application-level code for searching the index, including the definitions of the pages in the application and the logic of how they're connected.

The project also contains two additional components that allow you to host the web application, either on one or more Attivio node servers ([**module**](https://github.com/attivio/searchui/tree/master/module)) or from a servlet container such as Apache Tomcat ([**servlet**](https://github.com/attivio/searchui/tree/master/servlet)). The availability of certain functionality will vary depending on how you host and configure the Search UI application and which search engine you use, as described below.

## What is SUIT?

The SUIT library consists of various React components used by Search UI to render the UI and to interact with the index and other features. It also includes some API and utility classes, mainly used by the components directly but which the application-level code can also access. See the [GitHub repository](https://github.com/attivio/suit) for the SUIT library for documentation on using its components and other functionality.

## Installation and Deployment
Search UI has two deployment options. If you're interested in simply downloading a pre-built application, configuring your preferences and deploying it, choose one of the following options:
* **[Embedded](https://answers.attivio.com/display/extranet55/Search+UI+Download)** - *deploy as a module making it available from the Attivio Admin UI*

Deploying Search UI within the Attivio Admin UI is recommended for exploration of your data. It is not recommended that this method of deployment be used to serve Search UI to a large number of users in a production environment. Attivio recommends a Stand-alone deployment for production environments where Search UI is serving as the primary user interface.
* **[Stand-alone](DeploymentTomcat.md)**  - *deploy to an external web server such as Tomcat*

Stand-alone deployments are recommended when Search UI (or a customized version of it) is used as the primary user interface in your production environment. Deploying Search UI within the Attivio Admin UI could lead to resource contention since each Attivio node has other responsibilities, such as ingesting content or responding to queries. Stand-alone deployments can be done on the same host as Attivio nodes provided there are sufficient resources, though in many situations, dedicated hosts are recommended.

Stand-alone deployments are recommended when Search UI (or a customized version of it) is used as the primary user interface in your production environment. Deploying Search UI within the Attivio Admin UI could lead to resource contention since each Attivio node has other responsibilities, such as ingesting content or responding to queries. Stand-alone deployments can be done on the same host as Attivio nodes provided there are sufficient resources, though in many situations, dedicated hosts are recommended.

For instructions on building the application for one of the above deployment options, or if, instead, you wish to customize and build your own application for either deployment option, see the [Developer's Guide](DevelopersGuide.md) for instructions on setting up your development environment and building.

* **[SSO for REST](ConfiguringRESTSSO.md)**  - *use SSO to access the Attivio REST APIs*

This last option is useful in case you don't want to run the Search UI application and instead have a custom SSO-enabled web application which needs to be able to call the Attivio REST APIs directly from the user's browser (as opposed to accessing them from a server), so you don't expose the credentials of the Attivio server in your JavaScript code. This configuration can enable this functionality.

## How Can I Customize the Search UI?

To build your own search application using the SUIT library, with any or all of the features Search UI provides, see the [Developer's Guide](DevelopersGuide.md).

---

## Security
Search UI can be configured to require users to log in. The options vary depending on your deployment type.

| Deployment Type | Security Options | 
| --------------- | ---------------- | 
| Embedded (within Attivio) | <ul><li>[Active Directory](https://answers.attivio.com/display/extranet55/Active+Directory+Authentication+Provider)</li><li>[XML](https://answers.attivio.com/display/extranet55/XML+Authentication+Provider)</li></ul> | 
| Stand-alone (i.e. Tomcat)	 | <ul><li>[SSO](ConfiguringSSO.md)</li><li>[XML](ConfiguringXMLAuthentication.md)</li></ul> | 

Depending on the security option, users will either be presented with Attivio login form or one presented by the Identity Provider.

<img src="images/login-attivio.png" alt="Attivio Login Form" width="45%" /> <img src="images/login-okta.png?raw=true" alt="Okta Login Form" width="45%" />

## Cognitive Search
After logging in, if required, Search UI opens to its "Landing Page." The landing page provides a clean UI to start your search investigation.

<img src="images/landing-page.png?raw=true" alt="Landing Page" width="100%" />

**On this page you can:**
* [Ask a question](#question)
* Click on [Insights](#insights) to better understand your data

<a name="question"></a>
## Ask a Question

Whether you want to ask a free-form question or use our [Advanced Query Language (AQL)](https://answers.attivio.com/display/extranet55/Advanced+Query+Language) in this page you can get to the information you need. Hit **ENTER** or click **Go** to see the results.

<img src="images/italy.png?raw=true" alt="Results" width="100%" />

Following are some features of the results page:

| Feature | Description |
| ------- | ----------- |
| Logged-in user (Attivio Administrator in our case) <br/> <img src="images/username.png?raw=true" alt="Username" align="center" /> | The name of the logged-in user appears in the upper right corner, if available. Otherwise, the username is displayed with an option to log out. |
| Simple or Advanced Query Language <br/> <img src="images/query-language.png?raw=true" alt="Query Language" align="center" /> | Select between Attivio's [Simple Query Language](https://answers.attivio.com/display/extranet55/Simple+Query+Language) or the [Advanced Query Language](https://answers.attivio.com/display/extranet55/Advanced+Query+Language). |
| Search Box <br/> <img src="images/search box.png?raw=true" alt="Search Box" align="center" />| Enter the text of your query.  For the [Simple Query Language](https://answers.attivio.com/display/extranet55/Simple+Query+Language), enter a keyword or a field:keyword pair.  The string \*:\* retrieves all documents in all tables.  You can paste in more complex queries written in the [Advanced Query Language](https://answers.attivio.com/display/extranet55/Advanced+Query+Language), such as those demonstrated in the [Quick Start Tutorial](https://answers.attivio.com/display/extranet55/Quick+Start+Tutorial). |
| Facet Filters <br/> <img src="images/facets.png?raw=true" alt="Facets" align="center" /> | The left column of the display is devoted to facet controls.  Each one summarizes opportunities to "drill down" on the set of current results to narrow the search. |
| Applied Facets <br/> <img src="images/applied-facet.png?raw=true" alt="Applied Facet" align="center" /> | Under the header, the facet filters that have been applied to the search are displayed. Each item can be individually removed to widen the result set as needed. |
| Sort Control <br/> <img src="images/sort-by.png?raw=true" alt="Sort By" align="center" /> | The sort control reorders the result items. You can sort by relevancy and select which [relevancy model](https://answers.attivio.com/display/extranet55/Machine+Learning+Relevancy) to use, or by any sortable field in the schema. See [Sorting Results](https://answers.attivio.com/display/extranet55/Sorting+Results) for more information. |
| Relevancy Model <br/> <img src="images/relevancy.png?raw=true" alt="Relevancy" align="center" /> | If you choose Relevancy in the Sort Control, you can choose the Relevancy Model to use. See [Machine Learning Relevancy](https://answers.attivio.com/display/extranettrunk/Machine+Learning+Relevancy) for more information. |
| Paging Controls <br/> <img src="images/pagination.png?raw=true" alt="Pagination" align="center" /> | The paging controls let you page through the search results conveniently. |
| Matching Documents | The right column of this page is devoted to the display of matching documents. <ul><li>If there is a [Thumbnail Image](https://answers.attivio.com/display/extranet55/Thumbnail+and+Preview+Images) available, it will be displayed to the left of the document (like the flag images in the Quick Start Tutorial.)</li><li>The title of the document is often a hyperlink to the actual document or web page.</li><li>Search UI is preconfigured to show the **table** value of each matching document next to the result number.</li><li>By default, Search UI displays the document teaser, with matching terms [highlighted](https://answers.attivio.com/display/extranet55/Field+Expressions).<ul><li>Items that matched the query are shown in **bold** face.</li><li>[Scoped entities](https://answers.attivio.com/display/extranet55/Scope+Search) are color-coded:<ul><li>People: Yellow</li><li>Locations: Blue</li><li>Companies: Red</li></ul></li><li>[Key phrases](https://answers.attivio.com/display/extranet55/Key-Phrase+Extraction): Green</li><li>[Entity Sentiment](https://answers.attivio.com/display/extranet55/Using+Entity+Sentiment) is indicated by red and green plus or minus icons.</li></ul></li><li>Document Details consist of fields and values. Note that you can temporarily display all fields by setting the **Details** button next to the Sort Control to **On**.</li><li>The **Tags** field is a [Real Time Field](https://answers.attivio.com/display/extranet55/Real-Time+Updates) configured in the [Schema](https://answers.attivio.com/display/extranet55/Configure+the+Attivio+Schema). It lets you add labels to each document directly from the Results Page. These labels can then be collected into a new facet to assist in subsequent searches.</li></ul> |  
| User Rating <br/> <img src="images/stars.png?raw=true" alt="Rating" align="center" /> | A user can provide a rating for a document that can be used as a signal when using Machine Learning to create a relevancy model. See [Machine Learning Relevancy](https://answers.attivio.com/display/extranet55/Machine+Learning+Relevancy) for more information. |
| Show 360&deg; View | You can choose to see a  360&deg; view of a document to better understand the document and how it relates to other documents using our Knowledge Graph. |

---

## 360&deg; View
<img src="images/360-Italy.PNG?raw=true" alt="Italy 360 View" width="100%" />

The 360&deg; View page allows you to take a closer look at a single document and understand how it relates to other documents in the index.

In the 360&deg; View you can see the document text, extracted entities and the Knowledge Graph. The Knowledge Graph shows how this document is linked to other documents by matching the entities extracted.

If we look at "Italy" we can see it relates to two News documents based on mentions of the extracted locations of Italy and Germany.

<img src="images/graph.PNG?raw=true" alt="Knowledge Graph" width="100%" />

---

## Insights
The Insights page provides a dashboard that allows you to quickly understand your data without knowing what data was ingested.

Using our [Text Analytics](https://answers.attivio.com/display/extranet55/Attivio+Text+Analytics) capabilities and [facets](https://answers.attivio.com/display/extranet55/Facets) we build knowledge on top of your data so that you can better understand your data.

<img src="images/insights.png?raw=true" alt="Insights" width="100%" />

---
<a name="configuration"></a>
## How Do I Configure Search UI?
Many Search UI features are configurable, including pointing it to an Elasticsearch or Solr installation.  These settings support rapid prototyping for demos and proof-of-concept projects.  

> Setting these preferences will affect all users who may be accessing this application.
> If any values are not specified, the application uses system-application defaults.
> If Search UI is deployed to multiple web servers or Attivio nodes, the preferences must be manually synchronized across all nodes.

The full list of properties and the description of each can be found in the [configuration.properties.js](frontend/configuration.properties.js) file.

<a name="supported-browsers"></a>
## Supported Browsers
Search UI is tested with the following browsers at release time:

**Windows Clients:**

* Chrome stable - latest stable version
* Microsoft Edge - latest stable version
* Internet Explorer 11

**Mac clients:** 
* Chrome stable - latest stable version

**Linux clients:** 
* Chrome stable - latest stable version

**Recommended Screen Resolution:**
* 1280 x 800 pixels, 1600 x 900 pixels or higher

## Contributing
To report an issue or contribute, see [CONTRIBUTING.md](CONTRIBUTING.md)
