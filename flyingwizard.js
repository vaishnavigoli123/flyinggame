// Game state variables
let move_speed = 2.6, grativy = 0.4;

// Selecting the wizard element and its image
let wizard = document.querySelector('.wizard');
let img = document.getElementById('wizard-1');

// Sound effects for scoring points and dying
let sound_point = new Audio('assets/sound_point.mp3');
let sound_die = new Audio('assets/sound_dies.mp3');

// Getting bounding box properties of the wizard element
let wizard_props = wizard.getBoundingClientRect();

// Getting bounding box properties of the background
let background = document.querySelector('.background').getBoundingClientRect();

// Selecting the score and message elements
let score_val = document.querySelector('.score_val');
let message = document.querySelector('.message');
let score_title = document.querySelector('.score_title');

// Inital game setup
let game_state = 'Start';
img.style.display = 'none';
message.classList.add('messageStyle');

// Start the game UpArrow key
document.addEventListener('keydown', (e) => {
    if(e.key == 'ArrowUp' && game_state != 'Play'){
        // Remove exiting obstacles when restarting the game
        document.querySelectorAll('.pipe_sprite').forEach((e) => {
            e.remove();
        });
        // Game setup for a new start
        img.style.display = 'block';
        wizard.style.top = '40vh';
        game_state = 'Play';
        message.innerHTML = '';
        score_title.innerHTML = 'Score : ';
        score_val.innerHTML = '0';
        message.classList.remove('messageStyle');
        play();
    }
});


// The main function that runs the game.\
function play(){
    // Moves the obstacles from right to left
    function move(){
        if(game_state != 'Play') return;

        let pipe_sprite = document.querySelectorAll('.pipe_sprite');
        pipe_sprite.forEach((element) => {
            let pipe_sprite_props = element.getBoundingClientRect();
            wizard_props = wizard.getBoundingClientRect();

            // Check for collisons
            if(pipe_sprite_props.right <= 0){
                element.remove();
            }else{
                if(wizard_props.left < pipe_sprite_props.left + pipe_sprite_props.width && wizard_props.left + wizard_props.width > pipe_sprite_props.left && wizard_props.top < pipe_sprite_props.top + pipe_sprite_props.height && wizard_props.top + wizard_props.height > pipe_sprite_props.top){
                    game_state = 'End';
                    message.innerHTML = 'Game Over'.fontcolor('red') + '<br>Press Arrow To Restart';
                    message.classList.add('messageStyle');
                    img.style.display = 'none';
                    sound_die.play();
                    return;
                }else{
                    // Increment score when passing the obstacle
                    if(pipe_sprite_props.right < wizard_props.left && pipe_sprite_props.right + move_speed >= wizard_props.left && element.increase_score == '1'){
                        score_val.innerHTML =+ score_val.innerHTML + 1;
                        sound_point.play();
                    }
                    // Move the pipe towards the left
                    element.style.left = pipe_sprite_props.left - move_speed + 'px';
                }
            }
        });
        requestAnimationFrame(move); // Continously move obstacles
    }
    requestAnimationFrame(move);

    // Wiazrds vertical speed
    let wizard_dy = 0;
    
    //Applies gravity to the wizard and handles user input for jumping
    function apply_gravity(){
        if(game_state != 'Play') return;
        wizard_dy = wizard_dy + grativy;
        document.addEventListener('keydown', (e) => {
            if(e.key == 'ArrowUp' || e.key == ' '){
                img.src = 'assets/Wizard-2.png';
                wizard_dy = -7.6;
            }
        });

        document.addEventListener('keyup', (e) => {
            if(e.key == 'ArrowUp' || e.key == ' '){
                img.src = 'assets/Wizard.png';
            }
        });

        // Check for collision with top and botto of background
        if(wizard_props.top <= 0 || wizard_props.bottom >= background.bottom){
            game_state = 'End';
            message.style.left = '28vw';
            window.location.reload();
            message.classList.remove('messageStyle');
            return;
        }
        wizard.style.top = wizard_props.top + wizard_dy + 'px';
        wizard_props = wizard.getBoundingClientRect();
        requestAnimationFrame(apply_gravity);
    }
    requestAnimationFrame(apply_gravity);

    // Variable to control the separation between pipes
    let pipe_seperation = 0;

    // Define the gap between pairs of pipes
    let pipe_gap = 35;

    // Creates a pair of pipes as obstacles at random positions with a gap in between them.
    function create_pipe(){
        if(game_state != 'Play') return;

        if(pipe_seperation > 115){
            pipe_seperation = 0;

            // Calculate a random vertical position for the top pipe
            let pipe_posi = Math.floor(Math.random() * 43) + 8;
            // Create the top pipe
            let pipe_sprite_inv = document.createElement('div');
            pipe_sprite_inv.className = 'pipe_sprite';
            pipe_sprite_inv.style.top = pipe_posi - 70 + 'vh';
            pipe_sprite_inv.style.left = '100vw';

            document.body.appendChild(pipe_sprite_inv);

            // Create the bottom pipe
            let pipe_sprite = document.createElement('div');
            pipe_sprite.className = 'pipe_sprite';
            pipe_sprite.style.top = pipe_posi + pipe_gap + 'vh';
            pipe_sprite.style.left = '100vw';
            pipe_sprite.increase_score = '1';

            document.body.appendChild(pipe_sprite);
        }

        // Increment the separation value
        pipe_seperation++;
        requestAnimationFrame(create_pipe);
        // Continuously create pipes by recursively calling
    }

    // Start creating pipes when the script loads
    requestAnimationFrame(create_pipe);
}
