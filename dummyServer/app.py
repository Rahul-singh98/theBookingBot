from flask import Flask, request, redirect, url_for

app = Flask(__name__)

@app.route('/')
def index():
    return '''
        <form method="POST" action="/submit">
            <input type="text" name="name" placeholder="Enter your name" required>
            <input type="submit" value="Submit">
        </form>
    '''

@app.route('/submit', methods=['POST'])
def submit():
    # Get the form data
    name = request.form.get('name')
    
    # Process the data (you can perform any logic here)
    print(f'Received name: {name}')

    # Redirect to a different URL with the name as a query parameter
    return redirect(url_for('success', name=name))

@app.route('/success')
def success():
    # Get the name from the query parameters
    name = request.args.get('name')
    return f'Success! Hello, {name}!'

if __name__ == '__main__':
    app.run(debug=True)
