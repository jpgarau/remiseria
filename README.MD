# Notificaciones por Telegram
---
### En Telegram:
1. Iniciar chat con @BotFather
2. Enviar el comando `/start`
3. Enviar el comando `/newbot`
4. Ingresar un nombre para el bot, debe finalizar bot, por ejemlpo: *remiseriaX_bot*
5. Devolvera un resultado similar a esto:
> Done! Congratulations on your new bot. You will find it at t.me/remiseriX_bot. You can now add a description, about section and profile picture for your bot, see /help for a list of commands. By the way, when you've finished creating your cool bot, ping our Bot Support if you want a better username for it. Just make sure the bot is fully operational before you do this.
Use this token to access the HTTP API:
1111111111:AABaC5DDDbcGXf74ehEnr-abcdeM0RLYIf0
Keep your token secure and store it safely, it can be used by anyone to control your bot.
For a description of the Bot API, see this page: https://core.telegram.org/bots/api

6. Cargar el token en el archivo settings.php en la constante TOKEN
7. Desde el telefono usado por la operadora, que puede ser el mismo que en el que se creo el bot iniciar un chat con el bot
8. Enviar el comando `/start`
9. Luego mediante el uso de la api de Telegram se debe obtener el mensaje para poder obtener el ID de la operadora
10. Cargar el ID de la operadora en el archivo settings.php en la constante OPERADORA

### En el Sistema

1. El sistema registra cada usuario que interacture con el bot de y guardara su ID
2. Cada ID debera ser asignado a cada chofer de la empresa
3. Una vez registrado el sistema podrá enviar mensajes a cada chofer asignandole el viaje correspondiente según la descripción provista por la operadora.
4. Si el chofer da Libre, alguna de las zonas asignadas o Pone la aplicación en modo fuera de Servicio, esto genera un aviso por telegram a la Operadora.