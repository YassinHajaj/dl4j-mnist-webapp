package be.yh.dl4jmnistwebapp.resources

import be.yh.dl4jmnistwebapp.model.ModelWrapper
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.MediaType
import org.springframework.web.bind.annotation.*

@RestController
class ModelController {

    @Autowired
    lateinit var modelWrapper: ModelWrapper

    @PostMapping("/guess", consumes = [MediaType.APPLICATION_JSON_VALUE])
    fun guessInput(@RequestBody image: FrontEndImage): Int {
        return modelWrapper.guess(image.arrayOfPixels)
    }
}

data class FrontEndImage(val arrayOfPixels: IntArray = intArrayOf())