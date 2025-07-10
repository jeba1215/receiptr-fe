package com.example.rest_service;

public record Greeting(long id, String content) {

    public Greeting(long id, String content) {
        this.id = id;
        this.content = content;
    }

    @Override
    public String toString() {
        return "Greetings{" +
                "id=" + id +
                ", content='" + content + '\'' +
                '}';
    }
}
