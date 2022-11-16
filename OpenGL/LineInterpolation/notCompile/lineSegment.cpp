// Author: Oscar Valdés
// Last modified: November 1st, 2022
// Description: This program prints an interpolated set of points

#include <iostream>
#include <algorithm>
#include <vector>

struct Point {
    int x;
    int y;

    Point() {
        this->x = 0;
        this->y = 0;
    }
    
    Point(int x, int y) {
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

std::vector<Point> interpolate(Point p1, Point p2) {
    bool swap = false;
    std::vector<Point> points;
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
    
    int n = 20; // 20 IS THE NUMBER OF POINTS
    float stepSize = float(p2.x - p1.x) / float(n - 1);
    float m = slope(p1, p2);
    float b = originY(p1, m);
    

    for (int i = 1; i < n; i++)
    {
        int x = p1.x + stepSize * i;
        int y = yAt(x, m , b);

        if (swap && (points[points.size() - 1].x != y || points[points.size() - 1].y != x))
        {
            points.push_back(Point(y, x));
    
        } else if (!swap && (points[points.size() - 1].x != x || points[points.size() - 1].y != y)) {
            points.push_back(Point(x, y));
    
        }
    }

    return points;
}

int main() {
    Point p1, p2;
    std::cin >> p1.x;
    std::cin >> p1.y;
    std::cin >> p2.x;
    std::cin >> p2.y;

    std::vector<Point> points = interpolate(p1, p2);

    for (int i = 0; i < points.size(); i++)
    {
        std::cout << i << ". " << points[i] << std::endl;
    }

    return 0;
}