// glad, include glad *before* glfw
#include <glad/glad.h>
// GLFW
#include <GLFW/glfw3.h>

#include <iostream>
#include <algorithm>
#include <vector>
#include <math.h>

int WINDOW_WIDTH = 640;
int WINDOW_HEIGHT = 480;

void clipToWindow(float max, float &value) {
    value = (value / max) * 2 - 1;
}

struct Point {
    float x;
    float y;

    Point() {
        this->x = 0;
        this->y = 0;
    }
    
    Point(float x, float y) {
        this->x = x;
        this->y = y;
    }
};

void generateRegularPolygon(int sides, float radius, std::vector<Point> &points) {
    // Calculate the angle between each point
    float angle = 360.0f / sides;
    // Convert to radians
    angle = angle * M_PI / 180.0f;
    // Calculate the x and y coordinates of each point
    for (int i = 0; i < sides; i++) {
        float x = radius * cos(angle * i);
        float y = radius * sin(angle * i);
        points.push_back(Point(x, y));
    }
}

static unsigned int compileShader(unsigned int type, const char * source) {
    unsigned int id = glCreateShader(type);
    glShaderSource(id, 1, &source, NULL);
    glCompileShader(id);

    // Error handling
    int status;
    glGetShaderiv(id, GL_COMPILE_STATUS, &status);
    if (status == GL_FALSE) {
        int length;
        glGetShaderiv(id, GL_INFO_LOG_LENGTH, &length);
        char * message = (char *) alloca(length * sizeof(char));
        glGetShaderInfoLog(id, length, &length, message);
        std::cout << "ERROR: FAILED TO COMPILE " << (type == GL_VERTEX_SHADER ? "VERTEX" : "FRAGMENT") << " SHADER" << std::endl;
        std::cout << message << std::endl;
        glDeleteShader(id);
        return 0;
    } 
    

    return id;
}

static unsigned int createShader(const char * vertexShader, const char * fragmentShader) {
    unsigned int shaderProgram = glCreateProgram();
    unsigned int vs = compileShader(GL_VERTEX_SHADER, vertexShader);
    unsigned int fs = compileShader(GL_FRAGMENT_SHADER, fragmentShader);

    // Should assert both shaders compiled successfully

    glAttachShader(shaderProgram, vs);
    glAttachShader(shaderProgram, fs);

    glLinkProgram(shaderProgram);
    glValidateProgram(shaderProgram);

    glDeleteProgram(vs);
    glDeleteProgram(fs);

    return shaderProgram;
}

int main(void)
{
    /* Initialize the library */
    if (!glfwInit()) {
        return -1;
    }

    // Next three lines are escential to run shaders
    glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 3);
    glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 3);
    glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);

    #ifdef __APPLE__
        std::cout << "I'm apple machine" << std::endl;
        glfwWindowHint(GLFW_OPENGL_FORWARD_COMPAT, GL_TRUE);
    #endif

    /* Create a windowed mode window and its OpenGL context */
    GLFWwindow* window = glfwCreateWindow(WINDOW_WIDTH, WINDOW_HEIGHT, "Line Interpolation", NULL, NULL);
    if (!window)
    {
        glfwTerminate();
        return -1;
    }

    /* Make the window's context current */
    glfwMakeContextCurrent(window);

    // glad: load all OpenGL function pointers
    // ---------------------------------------
    if (!gladLoadGLLoader((GLADloadproc)glfwGetProcAddress))
    {
        std::cout << "ERROR: FAILED TO INITIALIZE GLAD" << std::endl;
        return -1;
    }

    std::cout << "GL VERSION: " << glGetString(GL_VERSION) << std::endl;

    std::vector<Point> points;
    // Generate a regular polygons with sides 5 - 12
    for (int i = 5; i <= 12; i++) {
        generateRegularPolygon(i, 200, points);
    }

    // Clip the points to the window
    for (int i = 0; i < points.size(); i++) {
        clipToWindow(WINDOW_WIDTH, points[i].x);
        clipToWindow(WINDOW_HEIGHT, points[i].y);
    }

    std::cout << "Normalized vectors" << std::endl;

    unsigned int VBO, VAO; // Id of buffer
    glGenVertexArrays(1, &VAO);
    glGenBuffers(1, &VBO); // Assign the id the value of 1 (0 is sometimes an error)
    // bind the Vertex Array Object first, then bind and set vertex buffer(s), and then configure vertex attributes(s).
    glBindVertexArray(VAO);

    glBindBuffer(GL_ARRAY_BUFFER, VBO); // Set the created buffer as the current buffer (remeber openGL is contextual, i.e. has states)
    glBufferData(GL_ARRAY_BUFFER, points.size() * sizeof(Point), &points[0], GL_STATIC_DRAW); // Store data in the buffer, last parameter is a hint

    // Call this function for every attribute, once here because we only have position
    // Index of attributes start at 0
    // Size of attribute is 2 beacause it spans two elements in the buffer
    // Elements are of type float
    // The size is measured in bytes
    // Offset between vertices 
    glVertexAttribPointer(0, 2, GL_FLOAT, GL_FALSE, sizeof(float) * 2, 0);
    glEnableVertexAttribArray(0);

    // "   gl_PointSize = 12;\n"
    const char * vertexShader =
    "#version 330 core\n"
    "\n"
    "layout(location = 0) in vec4 position;\n"
    "\n"
    "void main() {\n"
    "   gl_Position = position;\n"
    "}\n";

    const char * fragmentShader =
    "#version 330 core\n"
        "\n"
        "layout(location = 0) out vec4 color;\n"
        "\n"
        "void main() {\n"
        "   color = vec4(1.0f, 0.5f, 0.2f, 1.0f);\n"
        "}\n";

    // glEnable(GL_PROGRAM_POINT_SIZE);

    unsigned int shader = createShader(vertexShader, fragmentShader);
    glUseProgram(shader);

    /* Loop until the user closes the window */
    while (!glfwWindowShouldClose(window))
    {
        /* Render here */
        glClearColor(0.2f, 0.3f, 0.3f, 1.0f);
        glClear(GL_COLOR_BUFFER_BIT);

        // mode, offset and number of elements
        glDrawArrays(GL_POINTS, 0, points.size());

        /* Swap front and back buffers */
        glfwSwapBuffers(window);

        /* Poll for and process events */ 
        glfwPollEvents();
    }

    glDeleteShader(shader);

    glfwTerminate();
    return 0;
}