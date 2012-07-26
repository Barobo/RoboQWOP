#ifndef _SERVER_H_
#define _SERVER_H_

void error(const char *msg);
void init_mobots();
void *comm_thread(void *robot_id_val);
mobotJointState_t get_state(double val);
int process_command(char *commands, int length);
int handle_message(int client_sock);

#endif
