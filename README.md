# minimal-flask-react
Used the boilerplate minimal-flask-react: https://github.com/rwieruch/minimal-react-webpack-babel-setup

## Run Locally

1. Clone this repo
2. npm install
3. npm run dev
4. Get config.py file from email and put in root directory.
5. pip install -r requirements.txt
6. python server.py

## Disabling Caching
Sometimes changes aren't reflected due to browser caching, but caching can be disabled. 

For Chrome:
1. Open Chrome Devtools (Right-click > `Inspect`)
2. Click `Network` in top toolbar to open the network pane
3. Check the `Disable cache` checkbox (might have to make the devtool pane wider to see the option)
4. Keep Devtools console open. For some reason, even disabling cache checkbox is not fixing the issue unless console stays open.

Note that this setting is active only while the devtools are open.
