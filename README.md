# kura-web-log
Log level selector and viewer for [Eclipse Kura](http://www.eclipse.org/kura/).

Access it on your running kura instance on **http:/kura-ip-address/weblog** and simply click on the desired level to change the logger's logging level! No more need to access the OSGi console with telnet to change levels at runtime =)  
Very useful when developing your own bundles.
<img src="http://i.imgur.com/88mNJfz.png?1" />

## Download
[org.darugna.kura.weblog 1.0.1](https://docs.google.com/uc?id=0B0tptNwKwCF_UW0tOTBNZU83R0k&export=download)

## Compile it yourself
Clone the repository to your local machine

    git clone https://github.com/darugnaa/kura-web-log.git
    cd kura-web-log
    
Set the KURA_WS environment variable, pointing at your local Eclipse workspace

    # Windows
    setx KURA_WS c:\Users\you\eclipse-workspace
    # Linux / OSX
    export KURA_WS=/Users/you/eclipse-workspace
 
Now build with Maven

    mvn clean verify
    
After the compilation you will find the Deployment Package ready to be installed to a remote Kura!

## Kura compatibility
This release builds with the following *Developer's Workspace (with Web UI)* versions:
* Kura 1.2.0 **✓**
* Kura 1.2.1 **✓**
* Kura 1.2.2 **✓**
* Kura 1.3.0 **✗**

