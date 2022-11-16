// glad, include glad *before* glfw
#include <glad/glad.h>
// GLFW
#include <GLFW/glfw3.h>

#include <iostream>
#include <algorithm>
#include <vector>

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

    friend std::ostream & operator << (std::ostream &os, Point & p) {
        os << "(" << p.x << ", " << p.y << ")";
        return os;
    }
};

float slope(Point p1, Point p2) {
    return (p2.y - p1.y) / (p2.x - p1.x);
}

float originY(Point p, float m) {
    return p.y - m * p.x;
}

float yAt(float x, float m, float b) {
    return m * x + b;
}

void interpolate(Point p1, Point p2, std::vector<Point> &points) {
    bool swap = false;
    if (p2.x < p1.x)
    {
        Point temp = p2;
        p2 = p1;
        p1 = temp;

        points.push_back(p1);
    } else if (p2.x == p1.x) {
        int temp = p1.x;
        p1.x = p1.y;
        p1.y = temp;
        temp = p2.x;
        p2.x = p2.y;
        p2.y = temp;
        swap = true;

        if (p2.x < p1.x) {
            Point t = p2;
            p2 = p1;
            p1 = t;
        }

        points.push_back(Point(p1.y, p1.x));
    } else {
        points.push_back(p1);
    }
    
    int n = 200; // 20 IS THE NUMBER OF POINTS
    float stepSize = float(p2.x - p1.x) / float(n - 1);
    float m = slope(p1, p2);
    float b = originY(p1, m);
    

    for (int i = 1; i < n; i++) {
        int x = p1.x + stepSize * i;
        int y = yAt(x, m , b);

        if (swap && (points[points.size() - 1].x != y || points[points.size() - 1].y != x)) {
            points.push_back(Point(y, x));
    
        } else if (!swap && (points[points.size() - 1].x != x || points[points.size() - 1].y != y)) {
            points.push_back(Point(x, y));
        }
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


    Point p1(1, 2), p2(100, 20), p3(10,200), p4(50,10), p5(300,300), p6(10,10), p7(200,300), p8(250,50), p9 (350,350), p10(100, 300);

    std::vector<Point> points;
    interpolate(p1, p2, points);
    interpolate(p3, p4, points);
    interpolate(p5, p6, points);
    interpolate(p7, p8, points);
    interpolate(p9, p10, points);

    for (int j = 0; j < points.size(); j++) {
        clipToWindow(WINDOW_WIDTH, points[j].x);
        clipToWindow(WINDOW_HEIGHT, points[j].y);
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