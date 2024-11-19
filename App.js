import React, { useState, useEffect, useMemo, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, StyleSheet, Alert, Keyboard } from 'react-native';
import axios from 'axios';

export default function App() {
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [weatherData, setWeatherData] = useState(null);
    const inputRef = useRef(null);
    const apiKey = '0e94b5ffc559dbb7f57e51b09b614907'; 

    const fetchWeather = async () => {
        if (!latitude || !longitude) {
            Alert.alert('Erro', 'Preencha ambos os campos de latitude e longitude.');
            return;
        }
        try {
            const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric&lang=pt`
            );
            setWeatherData(response.data);
            Keyboard.dismiss();
        } catch (error) {
            console.error(error);
            Alert.alert('Erro', 'Clima nao encontrado');
        }
    };

    useEffect(() => {
        inputRef.current && inputRef.current.focus();
    }, []);

    const weatherInfo = useMemo(() => {
        if (!weatherData) return null;
        
        const { temp } = weatherData.main;
        const { description } = weatherData.weather[0];
        const { humidity } = weatherData.main;

        return { temp, description, humidity };
    }, [weatherData]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    ref={inputRef}
                    value={latitude}
                    onChangeText={setLatitude}
                    keyboardType="numeric"
                    placeholder="Latitude: Exemplo -23.5505"
                />
                <TextInput
                    style={styles.input}
                    value={longitude}
                    onChangeText={setLongitude}
                    keyboardType="numeric"
                    placeholder="Longitude: Exemplo -46.6333"
                />
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={fetchWeather}>
                    <Text style={styles.buttonText}>Buscar Clima</Text>
                </TouchableOpacity>
            </View>

            {weatherInfo && (
                <View style={styles.weatherResult}>
                    <Text style={styles.weatherText}>Temperatura: {weatherInfo.temp}°C</Text>
                    <Text style={styles.weatherText}>Descrição: {weatherInfo.description}</Text>
                    <Text style={styles.weatherText}>Umidade: {weatherInfo.humidity}%</Text>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f8ff',
        padding: 20,
    },
    inputContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        width: '90%',
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 15,
    },
    button: {
        height: 60,
        width: '40%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        backgroundColor: '#0782F9',
    },
    buttonText: {
        color: '#FFF',
        fontSize: 18,
    },
    weatherResult: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#e0f7fa',
        borderRadius: 5,
        alignItems: 'center',
    },
    weatherText: {
        fontSize: 16,
        marginBottom: 5,
    },
});
