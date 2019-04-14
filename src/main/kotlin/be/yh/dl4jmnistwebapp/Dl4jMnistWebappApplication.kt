package be.yh.dl4jmnistwebapp

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
open class Dl4jMnistWebappApplication

fun main(args: Array<String>) {
    runApplication<Dl4jMnistWebappApplication>(*args)
}
