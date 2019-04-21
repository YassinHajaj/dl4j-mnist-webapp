package be.yh.dl4jmnistwebapp.model

import org.deeplearning4j.nn.multilayer.MultiLayerNetwork
import org.deeplearning4j.util.ModelSerializer
import org.nd4j.linalg.api.ndarray.INDArray
import org.nd4j.linalg.factory.Nd4j
import org.springframework.beans.factory.config.BeanDefinition.SCOPE_SINGLETON
import org.springframework.context.annotation.Scope
import org.springframework.stereotype.Service
import java.nio.file.Files
import java.nio.file.Paths
import javax.annotation.PostConstruct

@Service
@Scope(SCOPE_SINGLETON)
class ModelWrapper {
    internal lateinit var model: MultiLayerNetwork

    @PostConstruct
    fun loadModel() {
        val path = Files.walk(Paths.get("."))
                .filter { path -> path.toFile().name.toString().contains("persisted-model") }
                .map { path -> path.toAbsolutePath().toString() }
                .findFirst()
                .orElseThrow { RuntimeException("persisted-model could not be found ! Check the path") }
        model = ModelSerializer.restoreMultiLayerNetwork(path)
    }

    fun guess(image: IntArray): Int {
        val ndArray = asNdArray(image)
        val output = model.output(ndArray)
        val data = output.data()
        val results = data.asInt()
        val guessResult = results.indexOf(1)
        return if (guessResult in 0..9) guessResult else throw Exception("Unrecognized number")
    }

    private fun asNdArray(newImage: IntArray): INDArray? {
        val mnistPixelsAmount = 28 * 28
        val ndArray = Nd4j.zeros(mnistPixelsAmount)

        for (i in 0 until mnistPixelsAmount) {
            ndArray.putScalar(i.toLong(), newImage[i])
        }
        return ndArray
    }
}