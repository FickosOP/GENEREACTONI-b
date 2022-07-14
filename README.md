# GENEREACTONI
<b>Generactoni is a tool for modeling front-end components and generating valid React components. </b>
<hr />
The goal of this project is to create simple to use web application to model front-end components in a way that is similar to existing tools for modeling UML diagrams(PowerDesigner, drawio etc.).
In addition <i>Genereactoni</i> will enable users to generate React projects in a way that will help them to speed up development process by reducing boilerplate code as well as providing valid architecture of a React application.
<h2>Component representation</h2>
Here you can see what information one component of your model contains before creating a valid React component(.jsx file).

<ul>
<li>Name (eg. UserPage)</li>
<li>
  Props (eg. userId, username)
</li>
<li>
  States (array of objects)
  <ul>
    <li>Name (eg. users)</li>
    <li>Default value (eg. [])</li>
  </ul>
  eg. states:[{name: "users", default: []}, {name: "newUser", default: {username:"user123" ...}]
</li>
<li>
  Effects
  <br/>Functions you want to call inside of useEffect hook. (will be imported from service package that will automatically generate a file and create a function with given name inside of that .js file)
  eg. effects: [getAllUsers ...]
</li>
<li>
  Actions <br/>
  Functions that will be activated upon triggering an event.
  eg. actions: [expandUserInfo(id), searchButtonClicked, searchValueChanged(e) ...]
</li>
<li>Return (HTML code)</li>
</ul>

Another useful feature that will be provided in <i>Genereactoni</i> will be dynamizing HTML. For example you have designed HTML and you want to import it into your React component. In order to avoid having to copy all content from body and then replace all static content, this tool will do it for you.<br />By adding prefix <i>'dyn-'</i> in the <i>name attribute of an element</i>, automatic dynamic value will be set(eg . \<h1 name="dyn-username">Username\</h1>, after transformation becomes \<h1 name="dyn-username">{username}\</h1>). If variable <i>username</i> cannot be found either in states or in props, the transformation will not apply.

By creating an inheritance relationship between two components, you will enable importing the child component into the parent component, and correctly extracting props in the child component.

<h2>Project structure</h2>
Here you can see the structure of React project if you decide to export your model. In the components directory, you will have .jsx files you marked as a component, in the pages directory, you will have .jsx files you marked as a page. The difference is that page files will be imported into App.js and will be included in the router so you can access the wanted page immediately after generating the project and starting the app using <b>npm start</b> command(that is why package.json is also generated). In the services/utils directories, you will find functions you defined in effects depending on whether you specified a function will execute an HTTP request(services) or not(utils).
<ul>
  <li>
    src
    <ul>
      <li>components</li>
      <li>pages</li>
      <li>services</li>
      <li>utils</li>
      <li>App.js</li>
      <li>config.js</li>
    </ul>
  </li>
  
  <li>package.json</li>
</ul>
