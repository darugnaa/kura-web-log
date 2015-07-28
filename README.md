# kura-web-log
Log level selector and viewer for [Eclipse Kura](http://www.eclipse.org/kura/).

<img src="http://i.imgur.com/88mNJfz.png?1" />



## Compile!
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
    
After the compilation you will find the Deployment Package ready to install to a remote Kura!
