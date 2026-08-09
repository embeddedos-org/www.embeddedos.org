import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { copyText } from "@/lib/clipboard";
import {
  Search,
  ChevronRight,
  Copy,
  Check,
  ExternalLink,
  X,
  Cpu,
  Zap,
  Network,
  Lock,
  RefreshCw,
  Activity,
  Settings,
  HardDrive,
  Battery,
  Globe,
  Bug,
  Package,
  Server,
  FileText,
  Terminal,
  Code2,
  Smartphone,
} from "lucide-react";
import { SIM_PLATFORM_COUNT } from "@/data/stack";

const MODULES = [
  {
    id: "hal",
    label: "HAL",
    icon: Cpu,
    color: "#22D3EE",
    title: "Hardware Abstraction Layer",
    description:
      "Low-level hardware access — GPIO, UART, SPI, I²C, Timer, Interrupts",
    subsections: [
      {
        name: "HAL Initialization",
        apis: [
          {
            sig: "int eos_hal_init(void)",
            desc: "Initialize the HAL layer. Must be called before any peripheral API.",
            ret: "0 on success, negative error code.",
            example: 'if (eos_hal_init() != 0) panic("HAL init failed");',
          },
          {
            sig: "void eos_hal_deinit(void)",
            desc: "Shut down all HAL peripherals and release resources.",
            ret: "void",
            example: "eos_hal_deinit(); // clean shutdown",
          },
          {
            sig: "void eos_delay_ms(uint32_t ms)",
            desc: "Block the calling task for at least ms milliseconds.",
            ret: "void",
            example: "eos_delay_ms(1000); // 1 second delay",
          },
          {
            sig: "uint32_t eos_get_tick_ms(void)",
            desc: "Return the number of milliseconds since HAL initialization.",
            ret: "Tick count in milliseconds.",
            example:
              "uint32_t t0 = eos_get_tick_ms();\n// ... work ...\nuint32_t elapsed = eos_get_tick_ms() - t0;",
          },
        ],
      },
      {
        name: "GPIO",
        structs: [
          {
            name: "eos_gpio_config_t",
            fields: [
              { name: "pin", type: "uint16_t", desc: "Pin number" },
              {
                name: "mode",
                type: "eos_gpio_mode_t",
                desc: "INPUT, OUTPUT, INPUT_PULLUP, INPUT_PULLDOWN, ANALOG",
              },
              {
                name: "pull",
                type: "eos_gpio_pull_t",
                desc: "PULL_NONE, PULL_UP, PULL_DOWN",
              },
              {
                name: "speed",
                type: "eos_gpio_speed_t",
                desc: "SPEED_LOW, SPEED_MEDIUM, SPEED_HIGH, SPEED_VERY_HIGH",
              },
            ],
          },
        ],
        apis: [
          {
            sig: "int eos_gpio_init(const eos_gpio_config_t *cfg)",
            desc: "Initialize a GPIO pin. Must be called before read/write/toggle.",
            ret: "0 on success, negative error code.",
            example:
              "eos_gpio_config_t led = {\n  .pin=13, .mode=EOS_GPIO_OUTPUT,\n  .pull=EOS_GPIO_PULL_NONE, .speed=EOS_GPIO_SPEED_LOW\n};\neos_gpio_init(&led);",
          },
          {
            sig: "void eos_gpio_deinit(uint16_t pin)",
            desc: "Release a GPIO pin, resetting it to default state.",
            ret: "void",
            example: "eos_gpio_deinit(13);",
          },
          {
            sig: "void eos_gpio_write(uint16_t pin, bool value)",
            desc: "Set GPIO output pin high or low.",
            ret: "void",
            example:
              "eos_gpio_write(13, true);  // LED on\neos_delay_ms(1000);\neos_gpio_write(13, false); // LED off",
          },
          {
            sig: "bool eos_gpio_read(uint16_t pin)",
            desc: "Read current state of a GPIO pin. Works for input and output pins.",
            ret: "true if high, false if low.",
            example:
              'eos_gpio_config_t btn = { .pin=2, .mode=EOS_GPIO_INPUT, .pull=EOS_GPIO_PULL_UP };\neos_gpio_init(&btn);\nif (!eos_gpio_read(2)) printf("Button pressed!\\n");',
          },
          {
            sig: "void eos_gpio_toggle(uint16_t pin)",
            desc: "Toggle a GPIO output pin (high→low or low→high).",
            ret: "void",
            example:
              "while (1) { eos_gpio_toggle(13); eos_delay_ms(500); } // 1 Hz blink",
          },
          {
            sig: "int eos_gpio_set_irq(uint16_t pin, eos_gpio_edge_t edge, eos_gpio_callback_t cb, void *ctx)",
            desc: "Attach interrupt callback to a GPIO pin on specified edge(s).",
            ret: "0 on success, negative error code.",
            example:
              "void on_btn(uint16_t pin, void *ctx) { *(int*)ctx += 1; }\nint count = 0;\neos_gpio_set_irq(2, EOS_GPIO_EDGE_FALLING, on_btn, &count);",
          },
        ],
      },
      {
        name: "UART",
        structs: [
          {
            name: "eos_uart_config_t",
            fields: [
              { name: "port", type: "uint8_t", desc: "UART port number" },
              {
                name: "baudrate",
                type: "uint32_t",
                desc: "Baud rate (9600, 115200, etc.)",
              },
              {
                name: "data_bits",
                type: "uint8_t",
                desc: "Data bits (7 or 8)",
              },
              {
                name: "parity",
                type: "eos_uart_parity_t",
                desc: "NONE, EVEN, ODD",
              },
              {
                name: "stop_bits",
                type: "eos_uart_stop_t",
                desc: "STOP_1, STOP_2",
              },
            ],
          },
        ],
        apis: [
          {
            sig: "int eos_uart_init(const eos_uart_config_t *cfg)",
            desc: "Initialize a UART port with baud rate, parity, and stop bits.",
            ret: "0 on success, negative error code.",
            example:
              "eos_uart_config_t uart = { .port=0, .baudrate=115200,\n  .data_bits=8, .parity=EOS_UART_PARITY_NONE, .stop_bits=EOS_UART_STOP_1 };\neos_uart_init(&uart);",
          },
          {
            sig: "int eos_uart_write(uint8_t port, const uint8_t *data, size_t len)",
            desc: "Write bytes to a UART port. Blocks until all bytes are transmitted.",
            ret: "Number of bytes written, or negative error code.",
            example:
              'const char *msg = "Hello EoS!\\r\\n";\neos_uart_write(0, (uint8_t*)msg, strlen(msg));',
          },
          {
            sig: "int eos_uart_read(uint8_t port, uint8_t *data, size_t len, uint32_t timeout_ms)",
            desc: "Read up to len bytes from UART. Returns when data available or timeout.",
            ret: "Number of bytes read, 0 on timeout, negative on error.",
            example:
              "uint8_t buf[64];\nint n = eos_uart_read(0, buf, sizeof(buf), 100);\nif (n > 0) process(buf, n);",
          },
          {
            sig: "void eos_uart_deinit(uint8_t port)",
            desc: "Disable UART port and release its pins.",
            ret: "void",
            example: "eos_uart_deinit(0);",
          },
          {
            sig: "int eos_uart_set_rx_callback(uint8_t port, eos_uart_rx_callback_t cb, void *ctx)",
            desc: "Register async receive callback. Called from ISR context on each received byte.",
            ret: "0 on success, negative error code.",
            example:
              "void on_rx(uint8_t port, uint8_t byte, void *ctx) {\n  ring_buf_push(ctx, byte);\n}\neos_uart_set_rx_callback(0, on_rx, &my_buf);",
          },
        ],
      },
      {
        name: "SPI",
        structs: [
          {
            name: "eos_spi_config_t",
            fields: [
              { name: "port", type: "uint8_t", desc: "SPI port number" },
              {
                name: "mode",
                type: "eos_spi_mode_t",
                desc: "MODE_0..3 (CPOL/CPHA)",
              },
              {
                name: "freq_hz",
                type: "uint32_t",
                desc: "Clock frequency in Hz",
              },
              {
                name: "cs_pin",
                type: "uint16_t",
                desc: "Chip select GPIO pin",
              },
              {
                name: "msb_first",
                type: "bool",
                desc: "true=MSB first, false=LSB first",
              },
            ],
          },
        ],
        apis: [
          {
            sig: "int eos_spi_init(const eos_spi_config_t *cfg)",
            desc: "Initialize SPI controller with given configuration.",
            ret: "0 on success, negative error code.",
            example:
              "eos_spi_config_t spi = { .port=0, .mode=EOS_SPI_MODE_0,\n  .freq_hz=1000000, .cs_pin=10, .msb_first=true };\neos_spi_init(&spi);",
          },
          {
            sig: "int eos_spi_transfer(uint8_t port, const uint8_t *tx, uint8_t *rx, size_t len)",
            desc: "Full-duplex SPI transfer. tx and rx may be NULL for half-duplex.",
            ret: "0 on success, negative error code.",
            example:
              "uint8_t cmd[2] = {0x03, 0x00};\nuint8_t data[4];\neos_spi_transfer(0, cmd, NULL, 2);\neos_spi_transfer(0, NULL, data, 4);",
          },
          {
            sig: "int eos_spi_write(uint8_t port, const uint8_t *data, size_t len)",
            desc: "Write-only SPI transfer (MISO ignored).",
            ret: "0 on success, negative error code.",
            example:
              "uint8_t reg_write[] = {0x80 | REG_CTRL, 0x07};\neos_spi_write(0, reg_write, 2);",
          },
          {
            sig: "int eos_spi_read(uint8_t port, uint8_t *data, size_t len)",
            desc: "Read-only SPI transfer (MOSI sends 0xFF).",
            ret: "0 on success, negative error code.",
            example: "uint8_t status;\neos_spi_read(0, &status, 1);",
          },
          {
            sig: "void eos_spi_deinit(uint8_t port)",
            desc: "Disable SPI controller and release pins.",
            ret: "void",
            example: "eos_spi_deinit(0);",
          },
        ],
      },
      {
        name: "I2C",
        structs: [
          {
            name: "eos_i2c_config_t",
            fields: [
              { name: "port", type: "uint8_t", desc: "I2C port number" },
              {
                name: "speed",
                type: "eos_i2c_speed_t",
                desc: "SPEED_100K, SPEED_400K, SPEED_1M",
              },
              { name: "scl_pin", type: "uint16_t", desc: "SCL GPIO pin" },
              { name: "sda_pin", type: "uint16_t", desc: "SDA GPIO pin" },
            ],
          },
        ],
        apis: [
          {
            sig: "int eos_i2c_init(const eos_i2c_config_t *cfg)",
            desc: "Initialize I2C bus controller.",
            ret: "0 on success, negative error code.",
            example:
              "eos_i2c_config_t i2c = { .port=0, .speed=EOS_I2C_SPEED_400K,\n  .scl_pin=22, .sda_pin=21 };\neos_i2c_init(&i2c);",
          },
          {
            sig: "int eos_i2c_write(uint8_t port, uint8_t addr, const uint8_t *data, size_t len)",
            desc: "Write bytes to I2C device at 7-bit address.",
            ret: "0 on success, negative error code (EOS_ERR_NACK if device not present).",
            example:
              "uint8_t reg_val[] = {0x01, 0x60}; // reg 0x01, value 0x60\neos_i2c_write(0, 0x48, reg_val, 2);",
          },
          {
            sig: "int eos_i2c_read(uint8_t port, uint8_t addr, uint8_t *data, size_t len)",
            desc: "Read bytes from I2C device at 7-bit address.",
            ret: "0 on success, negative error code.",
            example:
              "uint8_t result[2];\neos_i2c_read(0, 0x48, result, 2);\nint16_t temp_raw = (result[0] << 8) | result[1];",
          },
          {
            sig: "int eos_i2c_write_reg(uint8_t port, uint8_t addr, uint8_t reg, const uint8_t *data, size_t len)",
            desc: "Write to a specific register of an I2C device (write reg byte then data).",
            ret: "0 on success, negative error code.",
            example:
              "uint8_t config = 0x60;\neos_i2c_write_reg(0, 0x48, 0x01, &config, 1);",
          },
          {
            sig: "int eos_i2c_read_reg(uint8_t port, uint8_t addr, uint8_t reg, uint8_t *data, size_t len)",
            desc: "Read from a specific register of an I2C device (write reg, then read).",
            ret: "0 on success, negative error code.",
            example:
              "uint8_t raw[2];\neos_i2c_read_reg(0, 0x48, 0x00, raw, 2);",
          },
          {
            sig: "int eos_i2c_scan(uint8_t port, uint8_t *addrs, uint8_t max)",
            desc: "Scan I2C bus and return addresses of responding devices.",
            ret: "Number of devices found.",
            example:
              'uint8_t found[16];\nint n = eos_i2c_scan(0, found, 16);\nfor (int i=0;i<n;i++) printf("Device at 0x%02X\\n", found[i]);',
          },
          {
            sig: "void eos_i2c_deinit(uint8_t port)",
            desc: "Disable I2C controller and release pins.",
            ret: "void",
            example: "eos_i2c_deinit(0);",
          },
        ],
      },
      {
        name: "Timer",
        apis: [
          {
            sig: "int eos_timer_init(uint8_t timer_id, uint32_t period_us, eos_timer_callback_t cb, void *ctx)",
            desc: "Initialize a hardware timer with microsecond period and callback.",
            ret: "0 on success, negative error code.",
            example:
              "void on_tick(uint8_t id, void *ctx) { *(uint32_t*)ctx += 1; }\nuint32_t ticks = 0;\neos_timer_init(0, 1000, on_tick, &ticks); // 1 kHz",
          },
          {
            sig: "void eos_timer_start(uint8_t timer_id)",
            desc: "Start a previously initialized hardware timer.",
            ret: "void",
            example: "eos_timer_start(0);",
          },
          {
            sig: "void eos_timer_stop(uint8_t timer_id)",
            desc: "Stop a running hardware timer. Callback will no longer fire.",
            ret: "void",
            example: "eos_timer_stop(0);",
          },
          {
            sig: "void eos_timer_set_period(uint8_t timer_id, uint32_t period_us)",
            desc: "Change the period of a running or stopped timer.",
            ret: "void",
            example: "eos_timer_set_period(0, 500); // 2 kHz",
          },
          {
            sig: "void eos_timer_deinit(uint8_t timer_id)",
            desc: "Release hardware timer resources.",
            ret: "void",
            example: "eos_timer_deinit(0);",
          },
        ],
      },
    ],
  },
  {
    id: "kernel",
    label: "Kernel",
    icon: Settings,
    color: "#34D399",
    title: "Kernel (RTOS)",
    description:
      "Task management, mutexes, semaphores, message queues, software timers",
    subsections: [
      {
        name: "Lifecycle",
        apis: [
          {
            sig: "void eos_kernel_start(void)",
            desc: "Start the RTOS scheduler. Never returns. All tasks must be created before this call.",
            ret: "Never returns.",
            example:
              "eos_task_create(&main_task, main_fn, NULL, 2048, 5);\neos_kernel_start();",
          },
          {
            sig: "uint32_t eos_kernel_get_tick(void)",
            desc: "Return the current RTOS tick count (increments at configTICK_RATE_HZ).",
            ret: "Current tick count.",
            example: "uint32_t t = eos_kernel_get_tick();",
          },
          {
            sig: "void eos_kernel_suspend(void)",
            desc: "Suspend the scheduler. All tasks freeze. Use for atomic multi-step operations.",
            ret: "void",
            example:
              "eos_kernel_suspend();\n// atomic update\neos_kernel_resume();",
          },
          {
            sig: "void eos_kernel_resume(void)",
            desc: "Resume the scheduler after eos_kernel_suspend().",
            ret: "void",
            example: "eos_kernel_resume();",
          },
        ],
      },
      {
        name: "Task Management",
        structs: [
          {
            name: "eos_task_t",
            fields: [
              { name: "handle", type: "void *", desc: "Opaque task handle" },
              {
                name: "name",
                type: "const char *",
                desc: "Task name (for debugging)",
              },
              {
                name: "stack_size",
                type: "uint32_t",
                desc: "Stack size in bytes",
              },
              {
                name: "priority",
                type: "uint8_t",
                desc: "Priority 0 (lowest) to 31 (highest)",
              },
            ],
          },
        ],
        apis: [
          {
            sig: "int eos_task_create(eos_task_t *task, eos_task_fn_t fn, void *arg, uint32_t stack_sz, uint8_t priority)",
            desc: "Create a new RTOS task. The task starts running immediately if priority > current task.",
            ret: "0 on success, EOS_ERR_NOMEM if stack allocation fails.",
            example:
              "void blink_task(void *arg) {\n  while(1) { eos_gpio_toggle(13); eos_delay_ms(500); }\n}\neos_task_t blink;\neos_task_create(&blink, blink_task, NULL, 512, 3);",
          },
          {
            sig: "void eos_task_delete(eos_task_t *task)",
            desc: "Delete a task and free its stack. Pass NULL to delete the calling task.",
            ret: "void",
            example:
              "eos_task_delete(&blink); // delete from another task\neos_task_delete(NULL);   // self-delete",
          },
          {
            sig: "void eos_task_suspend(eos_task_t *task)",
            desc: "Suspend a task. It will not run until eos_task_resume() is called.",
            ret: "void",
            example: "eos_task_suspend(&sensor_task);",
          },
          {
            sig: "void eos_task_resume(eos_task_t *task)",
            desc: "Resume a previously suspended task.",
            ret: "void",
            example: "eos_task_resume(&sensor_task);",
          },
          {
            sig: "void eos_task_yield(void)",
            desc: "Yield CPU to any equal or higher priority task.",
            ret: "void",
            example: "while (!data_ready) eos_task_yield();",
          },
          {
            sig: "void eos_task_delay(uint32_t ticks)",
            desc: "Block the calling task for a number of RTOS ticks.",
            ret: "void",
            example: "eos_task_delay(pdMS_TO_TICKS(100)); // 100 ms",
          },
          {
            sig: "void eos_task_delay_until(uint32_t *last_wake, uint32_t period)",
            desc: "Precise periodic delay. Compensates for task execution time to maintain exact period.",
            ret: "void",
            example:
              "uint32_t last = eos_kernel_get_tick();\nwhile(1) {\n  eos_task_delay_until(&last, pdMS_TO_TICKS(10)); // 100 Hz\n  read_sensor();\n}",
          },
          {
            sig: "uint8_t eos_task_get_priority(eos_task_t *task)",
            desc: "Get the current priority of a task.",
            ret: "Task priority (0–31).",
            example: "uint8_t p = eos_task_get_priority(&my_task);",
          },
          {
            sig: "void eos_task_set_priority(eos_task_t *task, uint8_t priority)",
            desc: "Change the priority of a running task.",
            ret: "void",
            example: "eos_task_set_priority(&my_task, 10);",
          },
          {
            sig: "uint32_t eos_task_get_stack_hwm(eos_task_t *task)",
            desc: "Return the high-water mark of stack usage in bytes. Useful for sizing stacks.",
            ret: "Minimum free stack bytes ever recorded.",
            example:
              'printf("Stack HWM: %u bytes\\n", eos_task_get_stack_hwm(&my_task));',
          },
        ],
      },
      {
        name: "Mutex",
        apis: [
          {
            sig: "int eos_mutex_init(eos_mutex_t *m)",
            desc: "Initialize a mutex. Supports priority inheritance.",
            ret: "0 on success.",
            example: "eos_mutex_t uart_lock;\neos_mutex_init(&uart_lock);",
          },
          {
            sig: "int eos_mutex_lock(eos_mutex_t *m, uint32_t timeout_ms)",
            desc: "Acquire mutex. Blocks until available or timeout expires.",
            ret: "0 on success, EOS_ERR_TIMEOUT if timed out.",
            example:
              "if (eos_mutex_lock(&uart_lock, 100) == 0) {\n  eos_uart_write(0, data, len);\n  eos_mutex_unlock(&uart_lock);\n}",
          },
          {
            sig: "void eos_mutex_unlock(eos_mutex_t *m)",
            desc: "Release a mutex held by the calling task.",
            ret: "void",
            example: "eos_mutex_unlock(&uart_lock);",
          },
          {
            sig: "bool eos_mutex_try_lock(eos_mutex_t *m)",
            desc: "Try to acquire mutex without blocking.",
            ret: "true if acquired, false if already held.",
            example: "if (eos_mutex_try_lock(&m)) { /* got it */ }",
          },
          {
            sig: "void eos_mutex_destroy(eos_mutex_t *m)",
            desc: "Destroy a mutex and release its resources.",
            ret: "void",
            example: "eos_mutex_destroy(&uart_lock);",
          },
        ],
      },
      {
        name: "Semaphore",
        apis: [
          {
            sig: "int eos_sem_init(eos_sem_t *s, uint32_t initial, uint32_t max)",
            desc: "Initialize a counting semaphore with initial and maximum count.",
            ret: "0 on success.",
            example:
              "eos_sem_t slots;\neos_sem_init(&slots, 0, 10); // 0 available, max 10",
          },
          {
            sig: "int eos_sem_wait(eos_sem_t *s, uint32_t timeout_ms)",
            desc: "Decrement semaphore. Blocks if count is 0.",
            ret: "0 on success, EOS_ERR_TIMEOUT if timed out.",
            example:
              "eos_sem_wait(&data_ready, EOS_WAIT_FOREVER);\nprocess_data();",
          },
          {
            sig: "void eos_sem_post(eos_sem_t *s)",
            desc: "Increment semaphore count. May unblock a waiting task.",
            ret: "void",
            example:
              "// From ISR:\nvoid dma_done_isr(void) { eos_sem_post_from_isr(&data_ready); }",
          },
          {
            sig: "void eos_sem_post_from_isr(eos_sem_t *s)",
            desc: "Increment semaphore from interrupt context. Uses deferred task wakeup.",
            ret: "void",
            example: "void adc_isr(void) { eos_sem_post_from_isr(&adc_done); }",
          },
          {
            sig: "uint32_t eos_sem_get_count(eos_sem_t *s)",
            desc: "Return current semaphore count without blocking.",
            ret: "Current count.",
            example: 'printf("Available: %u\\n", eos_sem_get_count(&slots));',
          },
          {
            sig: "void eos_sem_destroy(eos_sem_t *s)",
            desc: "Destroy semaphore and release resources.",
            ret: "void",
            example: "eos_sem_destroy(&slots);",
          },
        ],
      },
      {
        name: "Message Queue",
        apis: [
          {
            sig: "int eos_queue_create(eos_queue_t *q, uint32_t item_size, uint32_t depth)",
            desc: "Create a message queue with fixed item size and depth.",
            ret: "0 on success, EOS_ERR_NOMEM if allocation fails.",
            example:
              "eos_queue_t sensor_q;\neos_queue_create(&sensor_q, sizeof(sensor_reading_t), 32);",
          },
          {
            sig: "int eos_queue_send(eos_queue_t *q, const void *item, uint32_t timeout_ms)",
            desc: "Copy item into queue. Blocks if queue is full.",
            ret: "0 on success, EOS_ERR_TIMEOUT if timed out.",
            example:
              "sensor_reading_t r = { .temp=25.3f, .ts=eos_get_tick_ms() };\neos_queue_send(&sensor_q, &r, 10);",
          },
          {
            sig: "int eos_queue_recv(eos_queue_t *q, void *item, uint32_t timeout_ms)",
            desc: "Remove and copy item from queue. Blocks if queue is empty.",
            ret: "0 on success, EOS_ERR_TIMEOUT if timed out.",
            example:
              "sensor_reading_t r;\nif (eos_queue_recv(&sensor_q, &r, 100) == 0) process(&r);",
          },
          {
            sig: "int eos_queue_peek(eos_queue_t *q, void *item, uint32_t timeout_ms)",
            desc: "Copy front item without removing it from the queue.",
            ret: "0 on success, EOS_ERR_TIMEOUT if timed out.",
            example: "sensor_reading_t r;\neos_queue_peek(&sensor_q, &r, 0);",
          },
          {
            sig: "uint32_t eos_queue_count(eos_queue_t *q)",
            desc: "Return number of items currently in the queue.",
            ret: "Item count.",
            example:
              'printf("%u items waiting\\n", eos_queue_count(&sensor_q));',
          },
          {
            sig: "void eos_queue_flush(eos_queue_t *q)",
            desc: "Remove all items from the queue.",
            ret: "void",
            example: "eos_queue_flush(&sensor_q);",
          },
          {
            sig: "void eos_queue_delete(eos_queue_t *q)",
            desc: "Delete queue and free memory.",
            ret: "void",
            example: "eos_queue_delete(&sensor_q);",
          },
        ],
      },
      {
        name: "Software Timers",
        apis: [
          {
            sig: "int eos_sw_timer_create(eos_sw_timer_t *t, const char *name, uint32_t period_ms, bool repeat, eos_timer_callback_t cb, void *ctx)",
            desc: "Create a software timer backed by the RTOS timer task.",
            ret: "0 on success.",
            example:
              'void heartbeat(uint8_t id, void *ctx) { eos_gpio_toggle(LED); }\neos_sw_timer_t hb;\neos_sw_timer_create(&hb, "heartbeat", 500, true, heartbeat, NULL);',
          },
          {
            sig: "void eos_sw_timer_start(eos_sw_timer_t *t)",
            desc: "Start or restart a software timer.",
            ret: "void",
            example: "eos_sw_timer_start(&hb);",
          },
          {
            sig: "void eos_sw_timer_stop(eos_sw_timer_t *t)",
            desc: "Stop a running software timer.",
            ret: "void",
            example: "eos_sw_timer_stop(&hb);",
          },
          {
            sig: "void eos_sw_timer_reset(eos_sw_timer_t *t)",
            desc: "Reset timer period (restart from zero).",
            ret: "void",
            example: "eos_sw_timer_reset(&watchdog); // pet the watchdog",
          },
          {
            sig: "void eos_sw_timer_delete(eos_sw_timer_t *t)",
            desc: "Delete software timer and free resources.",
            ret: "void",
            example: "eos_sw_timer_delete(&hb);",
          },
        ],
      },
    ],
  },
  {
    id: "multicore",
    label: "Multicore",
    icon: Zap,
    color: "#A78BFA",
    title: "Multicore Framework",
    description:
      "Core management, spinlocks, IPI, shared memory, atomics, task affinity",
    subsections: [
      {
        name: "Core Management",
        apis: [
          {
            sig: "int eos_core_get_id(void)",
            desc: "Return the ID of the currently executing core (0 = core 0, 1 = core 1, etc.).",
            ret: "Core ID.",
            example: 'printf("Running on core %d\\n", eos_core_get_id());',
          },
          {
            sig: "int eos_core_get_count(void)",
            desc: "Return the total number of available cores.",
            ret: "Core count.",
            example: 'printf("%d cores available\\n", eos_core_get_count());',
          },
          {
            sig: "int eos_core_launch(uint8_t core_id, eos_core_entry_t fn, void *arg)",
            desc: "Launch a function on a specific core. Used for SMP initialization.",
            ret: "0 on success.",
            example: "eos_core_launch(1, core1_main, NULL);",
          },
          {
            sig: "void eos_core_sync_barrier(void)",
            desc: "Synchronize all cores at this point. All cores must call this before any proceeds.",
            ret: "void",
            example: "eos_core_sync_barrier(); // all cores ready",
          },
        ],
      },
      {
        name: "Spinlocks",
        apis: [
          {
            sig: "void eos_spinlock_init(eos_spinlock_t *lock)",
            desc: "Initialize a spinlock for cross-core mutual exclusion.",
            ret: "void",
            example:
              "eos_spinlock_t shared_lock;\neos_spinlock_init(&shared_lock);",
          },
          {
            sig: "void eos_spinlock_acquire(eos_spinlock_t *lock)",
            desc: "Acquire spinlock. Busy-waits. Disables interrupts on the acquiring core.",
            ret: "void",
            example:
              "eos_spinlock_acquire(&shared_lock);\nshared_counter++;\neos_spinlock_release(&shared_lock);",
          },
          {
            sig: "void eos_spinlock_release(eos_spinlock_t *lock)",
            desc: "Release spinlock and re-enable interrupts.",
            ret: "void",
            example: "eos_spinlock_release(&shared_lock);",
          },
        ],
      },
      {
        name: "Shared Memory",
        apis: [
          {
            sig: "void *eos_shmem_alloc(size_t size)",
            desc: "Allocate a block of shared memory accessible from all cores.",
            ret: "Pointer to shared memory, or NULL on failure.",
            example:
              "float *shared_buf = eos_shmem_alloc(1024 * sizeof(float));",
          },
          {
            sig: "void eos_shmem_free(void *ptr)",
            desc: "Free shared memory block.",
            ret: "void",
            example: "eos_shmem_free(shared_buf);",
          },
        ],
      },
    ],
  },
  {
    id: "crypto",
    label: "Crypto",
    icon: Lock,
    color: "#F97316",
    title: "Cryptographic Services",
    description: "SHA-256, CRC, AES-256-GCM, RSA, ECC, TRNG",
    subsections: [
      {
        name: "SHA-256",
        apis: [
          {
            sig: "void eos_sha256(const uint8_t *data, size_t len, uint8_t out[32])",
            desc: "Compute SHA-256 hash of data in one call.",
            ret: "void",
            example:
              "uint8_t hash[32];\neos_sha256(firmware_buf, firmware_len, hash);",
          },
          {
            sig: "void eos_sha256_init(eos_sha256_ctx_t *ctx)",
            desc: "Initialize incremental SHA-256 context.",
            ret: "void",
            example: "eos_sha256_ctx_t ctx;\neos_sha256_init(&ctx);",
          },
          {
            sig: "void eos_sha256_update(eos_sha256_ctx_t *ctx, const uint8_t *data, size_t len)",
            desc: "Feed data into incremental SHA-256 context.",
            ret: "void",
            example: "eos_sha256_update(&ctx, chunk, chunk_len);",
          },
          {
            sig: "void eos_sha256_final(eos_sha256_ctx_t *ctx, uint8_t out[32])",
            desc: "Finalize SHA-256 and write 32-byte digest.",
            ret: "void",
            example: "eos_sha256_final(&ctx, hash);",
          },
        ],
      },
      {
        name: "AES",
        apis: [
          {
            sig: "int eos_aes256_gcm_encrypt(const uint8_t key[32], const uint8_t iv[12], const uint8_t *plain, size_t len, uint8_t *cipher, uint8_t tag[16])",
            desc: "Encrypt data with AES-256-GCM. Produces ciphertext + 16-byte authentication tag.",
            ret: "0 on success.",
            example:
              "uint8_t cipher[len], tag[16];\neos_aes256_gcm_encrypt(key, iv, plain, len, cipher, tag);",
          },
          {
            sig: "int eos_aes256_gcm_decrypt(const uint8_t key[32], const uint8_t iv[12], const uint8_t *cipher, size_t len, const uint8_t tag[16], uint8_t *plain)",
            desc: "Decrypt and verify AES-256-GCM ciphertext. Fails if tag does not match.",
            ret: "0 on success, EOS_ERR_AUTH if tag mismatch.",
            example:
              'if (eos_aes256_gcm_decrypt(key, iv, cipher, len, tag, plain) != 0)\n  panic("Authentication failed");',
          },
        ],
      },
      {
        name: "TRNG",
        apis: [
          {
            sig: "int eos_trng_read(uint8_t *buf, size_t len)",
            desc: "Read cryptographically secure random bytes from the hardware TRNG.",
            ret: "0 on success.",
            example: "uint8_t nonce[16];\neos_trng_read(nonce, sizeof(nonce));",
          },
        ],
      },
    ],
  },
  {
    id: "ota",
    label: "OTA",
    icon: RefreshCw,
    color: "#22D3EE",
    title: "OTA Updates",
    description:
      "A/B slot management, verified boot, rollback protection, delta updates",
    subsections: [
      {
        name: "OTA Management",
        apis: [
          {
            sig: "int eos_ota_begin(eos_ota_handle_t *h, size_t total_size)",
            desc: "Begin an OTA update session. Selects the inactive slot for writing.",
            ret: "0 on success, EOS_ERR_BUSY if update already in progress.",
            example:
              "eos_ota_handle_t ota;\neos_ota_begin(&ota, firmware_size);",
          },
          {
            sig: "int eos_ota_write(eos_ota_handle_t *h, const uint8_t *data, size_t len)",
            desc: "Write a chunk of firmware data to the inactive OTA slot.",
            ret: "0 on success, negative error code.",
            example:
              "while (recv_chunk(&buf, &chunk_len))\n  eos_ota_write(&ota, buf, chunk_len);",
          },
          {
            sig: "int eos_ota_end(eos_ota_handle_t *h)",
            desc: "Finalize OTA write, verify SHA-256 hash, and mark slot as pending.",
            ret: "0 on success, EOS_ERR_VERIFY if hash mismatch.",
            example:
              "if (eos_ota_end(&ota) == 0)\n  eos_ota_set_boot_partition(EOS_OTA_NEXT);",
          },
          {
            sig: "int eos_ota_abort(eos_ota_handle_t *h)",
            desc: "Abort an in-progress OTA update and erase the partial write.",
            ret: "0 on success.",
            example: "eos_ota_abort(&ota); // on network error",
          },
          {
            sig: "int eos_ota_set_boot_partition(eos_ota_partition_t part)",
            desc: "Set which partition boots next: EOS_OTA_CURRENT, EOS_OTA_NEXT, or EOS_OTA_FACTORY.",
            ret: "0 on success.",
            example:
              "eos_ota_set_boot_partition(EOS_OTA_NEXT);\neos_restart();",
          },
          {
            sig: "eos_ota_partition_t eos_ota_get_running_partition(void)",
            desc: "Return which OTA partition is currently running.",
            ret: "EOS_OTA_PARTITION_0, _1, or _FACTORY.",
            example:
              'printf("Running slot: %d\\n", eos_ota_get_running_partition());',
          },
          {
            sig: "int eos_ota_mark_valid(void)",
            desc: "Mark the current partition as valid. Must be called after successful boot to prevent rollback.",
            ret: "0 on success.",
            example: "// After verifying app works:\neos_ota_mark_valid();",
          },
        ],
      },
    ],
  },
  {
    id: "sensor",
    label: "Sensors",
    icon: Activity,
    color: "#F59E0B",
    title: "Sensor Framework",
    description:
      "Unified sensor registration, calibration, fusion, and streaming",
    subsections: [
      {
        name: "Sensor API",
        apis: [
          {
            sig: "int eos_sensor_register(eos_sensor_t *s, const eos_sensor_ops_t *ops)",
            desc: "Register a sensor driver with the sensor framework.",
            ret: "0 on success, negative error code.",
            example:
              "extern const eos_sensor_ops_t bme280_ops;\neos_sensor_t bme280;\neos_sensor_register(&bme280, &bme280_ops);",
          },
          {
            sig: "int eos_sensor_open(eos_sensor_t *s)",
            desc: "Open and power on a registered sensor.",
            ret: "0 on success.",
            example: "eos_sensor_open(&bme280);",
          },
          {
            sig: "int eos_sensor_read(eos_sensor_t *s, eos_sensor_data_t *data)",
            desc: "Read latest sensor data. Returns immediately with most recent sample.",
            ret: "0 on success, EOS_ERR_NOT_READY if no data yet.",
            example:
              'eos_sensor_data_t d;\neos_sensor_read(&bme280, &d);\nprintf("Temp: %.1f°C\\n", d.temperature);',
          },
          {
            sig: "int eos_sensor_set_rate(eos_sensor_t *s, uint32_t hz)",
            desc: "Set sensor sampling rate in Hz.",
            ret: "0 on success, EOS_ERR_UNSUPPORTED if rate not available.",
            example: "eos_sensor_set_rate(&imu, 200); // 200 Hz IMU",
          },
          {
            sig: "int eos_sensor_subscribe(eos_sensor_t *s, eos_sensor_callback_t cb, void *ctx)",
            desc: "Subscribe to sensor data via callback. Called at the sensor's configured rate.",
            ret: "0 on success.",
            example:
              "void on_imu(eos_sensor_t *s, eos_sensor_data_t *d, void *ctx) {\n  attitude_update(d->accel, d->gyro);\n}\neos_sensor_subscribe(&imu, on_imu, NULL);",
          },
          {
            sig: "int eos_sensor_calibrate(eos_sensor_t *s, eos_calib_type_t type)",
            desc: "Run sensor calibration routine (offset, scale, or full factory cal).",
            ret: "0 on success.",
            example: "eos_sensor_calibrate(&imu, EOS_CALIB_OFFSET);",
          },
          {
            sig: "void eos_sensor_close(eos_sensor_t *s)",
            desc: "Power off and close sensor.",
            ret: "void",
            example: "eos_sensor_close(&bme280);",
          },
        ],
      },
    ],
  },
  {
    id: "filesystem",
    label: "Filesystem",
    icon: HardDrive,
    color: "#60A5FA",
    title: "Filesystem",
    description:
      "POSIX-compatible file I/O, directory operations, flash wear leveling",
    subsections: [
      {
        name: "File Operations",
        apis: [
          {
            sig: "int eos_fs_mount(const char *path, eos_fs_type_t type, const eos_fs_config_t *cfg)",
            desc: "Mount a filesystem at the given path. Supports LittleFS, FAT, and SPIFFS.",
            ret: "0 on success.",
            example:
              'eos_fs_config_t cfg = { .flash_base=0x200000, .flash_size=0x100000 };\neos_fs_mount("/data", EOS_FS_LITTLEFS, &cfg);',
          },
          {
            sig: "eos_file_t *eos_fs_open(const char *path, const char *mode)",
            desc: 'Open a file. Mode: "r", "w", "a", "r+", "w+".',
            ret: "File handle, or NULL on error.",
            example: 'eos_file_t *f = eos_fs_open("/data/log.txt", "a");',
          },
          {
            sig: "int eos_fs_write(eos_file_t *f, const void *buf, size_t len)",
            desc: "Write bytes to an open file.",
            ret: "Number of bytes written, or negative error code.",
            example: "eos_fs_write(f, line, strlen(line));",
          },
          {
            sig: "int eos_fs_read(eos_file_t *f, void *buf, size_t len)",
            desc: "Read bytes from an open file.",
            ret: "Number of bytes read, 0 at EOF, negative on error.",
            example:
              "char buf[256];\nint n = eos_fs_read(f, buf, sizeof(buf));",
          },
          {
            sig: "int eos_fs_seek(eos_file_t *f, long offset, int whence)",
            desc: "Seek to position. whence: SEEK_SET, SEEK_CUR, SEEK_END.",
            ret: "0 on success.",
            example: "eos_fs_seek(f, 0, SEEK_SET); // rewind",
          },
          {
            sig: "long eos_fs_tell(eos_file_t *f)",
            desc: "Return current file position.",
            ret: "Current position in bytes.",
            example: "long pos = eos_fs_tell(f);",
          },
          {
            sig: "void eos_fs_close(eos_file_t *f)",
            desc: "Close file and flush any buffered writes.",
            ret: "void",
            example: "eos_fs_close(f);",
          },
          {
            sig: "int eos_fs_remove(const char *path)",
            desc: "Delete a file or empty directory.",
            ret: "0 on success.",
            example: 'eos_fs_remove("/data/old.log");',
          },
          {
            sig: "int eos_fs_rename(const char *old, const char *new_path)",
            desc: "Rename or move a file.",
            ret: "0 on success.",
            example: 'eos_fs_rename("/tmp/new.bin", "/app/firmware.bin");',
          },
          {
            sig: "int eos_fs_stat(const char *path, eos_fs_stat_t *st)",
            desc: "Get file metadata (size, type, timestamps).",
            ret: "0 on success.",
            example:
              'eos_fs_stat_t st;\neos_fs_stat("/data/log.txt", &st);\nprintf("Size: %lu\\n", st.size);',
          },
        ],
      },
    ],
  },
  {
    id: "power",
    label: "Power",
    icon: Battery,
    color: "#FBBF24",
    title: "Power Management",
    description:
      "Sleep modes, wake sources, voltage scaling, battery monitoring",
    subsections: [
      {
        name: "Power API",
        apis: [
          {
            sig: "void eos_power_sleep(eos_sleep_mode_t mode)",
            desc: "Enter low-power sleep mode. Returns when a wake source fires.",
            ret: "void",
            example:
              "eos_power_sleep(EOS_SLEEP_LIGHT); // ~1 mA\neos_power_sleep(EOS_SLEEP_DEEP);  // ~10 µA",
          },
          {
            sig: "int eos_power_set_wake_source(eos_wake_src_t src, void *cfg)",
            desc: "Configure a wake source (GPIO, RTC, UART, timer).",
            ret: "0 on success.",
            example:
              "eos_rtc_alarm_t alarm = { .seconds=30 };\neos_power_set_wake_source(EOS_WAKE_RTC, &alarm);",
          },
          {
            sig: "float eos_power_get_vbat(void)",
            desc: "Read battery voltage in volts.",
            ret: "Battery voltage.",
            example: 'printf("Battery: %.2fV\\n", eos_power_get_vbat());',
          },
          {
            sig: "int eos_power_get_soc(void)",
            desc: "Estimate battery state of charge (0–100%).",
            ret: "SOC percentage.",
            example: 'printf("Battery: %d%%\\n", eos_power_get_soc());',
          },
          {
            sig: "void eos_power_set_cpu_freq(uint32_t hz)",
            desc: "Set CPU clock frequency for power/performance tradeoff.",
            ret: "void",
            example:
              "eos_power_set_cpu_freq(48000000);  // 48 MHz low power\neos_power_set_cpu_freq(240000000); // 240 MHz full speed",
          },
        ],
      },
    ],
  },
  {
    id: "net",
    label: "Network",
    icon: Globe,
    color: "#34D399",
    title: "Networking",
    description: "TCP/UDP sockets, HTTP client, MQTT, mDNS, TLS",
    subsections: [
      {
        name: "Sockets",
        apis: [
          {
            sig: "int eos_socket(int domain, int type, int protocol)",
            desc: "Create a network socket. Mirrors POSIX socket().",
            ret: "Socket fd, or negative error code.",
            example: "int fd = eos_socket(AF_INET, SOCK_STREAM, 0);",
          },
          {
            sig: "int eos_connect(int fd, const eos_sockaddr_t *addr)",
            desc: "Connect TCP socket to remote address.",
            ret: "0 on success.",
            example:
              'eos_sockaddr_t addr = { .ip="192.168.1.1", .port=80 };\neos_connect(fd, &addr);',
          },
          {
            sig: "int eos_send(int fd, const void *buf, size_t len, int flags)",
            desc: "Send data on a connected socket.",
            ret: "Bytes sent, or negative error code.",
            example: "eos_send(fd, request, strlen(request), 0);",
          },
          {
            sig: "int eos_recv(int fd, void *buf, size_t len, int flags)",
            desc: "Receive data from a connected socket.",
            ret: "Bytes received, 0 on close, negative on error.",
            example:
              "char resp[1024];\nint n = eos_recv(fd, resp, sizeof(resp), 0);",
          },
          {
            sig: "void eos_close(int fd)",
            desc: "Close socket and release resources.",
            ret: "void",
            example: "eos_close(fd);",
          },
        ],
      },
      {
        name: "HTTP Client",
        apis: [
          {
            sig: "int eos_http_get(const char *url, eos_http_resp_t *resp)",
            desc: "Perform HTTP GET request. Follows redirects, supports HTTPS.",
            ret: "HTTP status code, or negative error code.",
            example:
              'eos_http_resp_t r;\neos_http_get("https://api.example.com/data", &r);\nprintf("%s\\n", r.body);',
          },
          {
            sig: "int eos_http_post(const char *url, const char *body, const char *content_type, eos_http_resp_t *resp)",
            desc: "Perform HTTP POST request with body.",
            ret: "HTTP status code, or negative error code.",
            example:
              'eos_http_resp_t r;\neos_http_post("https://api.example.com/log",\n  "{\\"temp\\":25.3}", "application/json", &r);',
          },
        ],
      },
      {
        name: "MQTT Client",
        apis: [
          {
            sig: "int eos_mqtt_connect(eos_mqtt_client_t *c, const eos_mqtt_config_t *cfg)",
            desc: "Connect to MQTT broker with optional TLS and authentication.",
            ret: "0 on success.",
            example:
              'eos_mqtt_config_t cfg = { .host="broker.example.com",\n  .port=8883, .tls=true, .client_id="device-001" };\neos_mqtt_connect(&mqtt, &cfg);',
          },
          {
            sig: "int eos_mqtt_publish(eos_mqtt_client_t *c, const char *topic, const void *payload, size_t len, uint8_t qos)",
            desc: "Publish message to MQTT topic at QoS 0, 1, or 2.",
            ret: "0 on success.",
            example:
              'eos_mqtt_publish(&mqtt, "sensors/temp",\n  &temp_f32, sizeof(float), 1);',
          },
          {
            sig: "int eos_mqtt_subscribe(eos_mqtt_client_t *c, const char *topic, uint8_t qos, eos_mqtt_callback_t cb, void *ctx)",
            desc: "Subscribe to MQTT topic with callback.",
            ret: "0 on success.",
            example:
              'void on_cmd(const char *topic, const uint8_t *payload, size_t len, void *ctx) {\n  handle_command(payload, len);\n}\neos_mqtt_subscribe(&mqtt, "device/cmd", 1, on_cmd, NULL);',
          },
          {
            sig: "void eos_mqtt_disconnect(eos_mqtt_client_t *c)",
            desc: "Disconnect from MQTT broker.",
            ret: "void",
            example: "eos_mqtt_disconnect(&mqtt);",
          },
        ],
      },
    ],
  },
  {
    id: "debug",
    label: "Debug",
    icon: Bug,
    color: "#F85149",
    title: "Debug Tools",
    description: "GDB stub, core dump, stack canary, trace, profiler",
    subsections: [
      {
        name: "GDB Stub",
        apis: [
          {
            sig: "void eos_gdb_init(uint8_t uart_port, uint32_t baud)",
            desc: "Initialize GDB remote stub on UART. Allows GDB to attach and debug.",
            ret: "void",
            example: "eos_gdb_init(0, 115200); // GDB on UART0",
          },
          {
            sig: "void eos_gdb_breakpoint(void)",
            desc: "Trigger a software breakpoint. Halts execution and waits for GDB.",
            ret: "void",
            example: "if (error_condition) eos_gdb_breakpoint();",
          },
        ],
      },
      {
        name: "Core Dump",
        apis: [
          {
            sig: "void eos_coredump_enable(const char *path)",
            desc: "Enable automatic core dump to filesystem on crash.",
            ret: "void",
            example: 'eos_coredump_enable("/data/crash.bin");',
          },
          {
            sig: "void eos_coredump_trigger(void)",
            desc: "Manually trigger a core dump of the current state.",
            ret: "void",
            example: "eos_coredump_trigger();",
          },
          {
            sig: "int eos_coredump_analyze(const char *path, eos_coredump_info_t *info)",
            desc: "Parse a core dump file and extract crash information.",
            ret: "0 on success.",
            example:
              'eos_coredump_info_t info;\neos_coredump_analyze("/data/crash.bin", &info);\nprintf("Crash at PC=0x%08X\\n", info.pc);',
          },
        ],
      },
    ],
  },
  {
    id: "logging",
    label: "Logging",
    icon: FileText,
    color: "#A78BFA",
    title: "Logging",
    description:
      "Structured logging with levels, tags, backends, and ring buffer",
    subsections: [
      {
        name: "Log API",
        apis: [
          {
            sig: "void eos_log(eos_log_level_t level, const char *tag, const char *fmt, ...)",
            desc: "Log a message with level and tag. Printf-style format string.",
            ret: "void",
            example:
              'eos_log(EOS_LOG_INFO, "SENSOR", "Temp: %.1f°C", temp);\neos_log(EOS_LOG_ERROR, "NET", "Connect failed: %d", err);',
          },
          {
            sig: "void eos_log_set_level(const char *tag, eos_log_level_t level)",
            desc: 'Set minimum log level for a specific tag (or "*" for all).',
            ret: "void",
            example:
              'eos_log_set_level("*", EOS_LOG_WARN);     // silence all below WARN\neos_log_set_level("SENSOR", EOS_LOG_DEBUG); // verbose for SENSOR',
          },
          {
            sig: "void eos_log_add_backend(eos_log_backend_t *backend)",
            desc: "Add a log backend (UART, filesystem, network, custom).",
            ret: "void",
            example:
              "extern eos_log_backend_t uart_backend;\neos_log_add_backend(&uart_backend);",
          },
          {
            sig: "void eos_log_flush(void)",
            desc: "Flush all pending log messages to all backends.",
            ret: "void",
            example: "eos_log_flush(); // before sleep or reboot",
          },
        ],
      },
    ],
  },
  {
    id: "services",
    label: "Services",
    icon: Server,
    color: "#F472B6",
    title: "Service Manager",
    description:
      "Service lifecycle, dependency resolution, health monitoring, restart policies",
    subsections: [
      {
        name: "Service API",
        apis: [
          {
            sig: "int eos_service_register(eos_service_t *svc, const eos_service_ops_t *ops)",
            desc: "Register a service with the service manager.",
            ret: "0 on success.",
            example:
              "extern const eos_service_ops_t mqtt_service_ops;\neos_service_t mqtt_svc;\neos_service_register(&mqtt_svc, &mqtt_service_ops);",
          },
          {
            sig: "int eos_service_start(eos_service_t *svc)",
            desc: "Start a registered service. Resolves dependencies first.",
            ret: "0 on success, EOS_ERR_DEP if dependency start failed.",
            example: "eos_service_start(&mqtt_svc);",
          },
          {
            sig: "int eos_service_stop(eos_service_t *svc)",
            desc: "Stop a running service gracefully.",
            ret: "0 on success.",
            example: "eos_service_stop(&mqtt_svc);",
          },
          {
            sig: "eos_service_state_t eos_service_get_state(eos_service_t *svc)",
            desc: "Return current service state: STOPPED, STARTING, RUNNING, STOPPING, FAILED.",
            ret: "Service state enum.",
            example:
              "if (eos_service_get_state(&mqtt_svc) == EOS_SVC_RUNNING)\n  eos_mqtt_publish(...);",
          },
          {
            sig: "void eos_service_set_restart_policy(eos_service_t *svc, eos_restart_policy_t policy)",
            desc: "Set restart policy: NEVER, ON_FAILURE, ALWAYS.",
            ret: "void",
            example:
              "eos_service_set_restart_policy(&mqtt_svc, EOS_RESTART_ON_FAILURE);",
          },
        ],
      },
    ],
  },
  {
    id: "eai",
    label: "EAI",
    icon: Zap,
    color: "#A855F7",
    title: "EAI — Embedded AI Runtime",
    description:
      "On-device LLM inference, ReAct agents, LoRA fine-tuning, and federated learning",
    subsections: [
      {
        name: "Configuration API",
        apis: [
          {
            sig: "void eai_config_init(eai_config_t *cfg)",
            desc: "Initialize config struct with safe defaults (INT4 quantization, CPU backend).",
            ret: "void",
            example: "eai_config_t cfg;\neai_config_init(&cfg);",
          },
          {
            sig: "eai_status_t eai_config_load_file(eai_config_t *cfg, const char *path)",
            desc: "Load YAML config from filesystem. Merges over defaults.",
            ret: "EAI_OK on success, EAI_ERR_IO on file error.",
            example:
              'if (eai_config_load_file(&cfg, "/etc/eai/config.yml") != EAI_OK) EOS_WARN("Config load failed");',
          },
          {
            sig: "void eai_config_dump(const eai_config_t *cfg)",
            desc: "Print current config to EoS log at INFO level.",
            ret: "void",
            example: "eai_config_dump(&cfg); // print loaded config",
          },
        ],
      },
      {
        name: "Tool Registry API",
        apis: [
          {
            sig: "eai_status_t eai_tool_register(const char *name, eai_tool_fn_t fn, const char *schema_json)",
            desc: "Register a named tool the agent can call. schema_json is a JSON Schema string.",
            ret: "EAI_OK on success.",
            example: 'eai_tool_register("gpio_write", gpio_exec, GPIO_SCHEMA);',
          },
          {
            sig: "eai_status_t eai_tool_unregister(const char *name)",
            desc: "Remove a previously registered tool.",
            ret: "EAI_OK on success.",
            example: 'eai_tool_unregister("gpio_write");',
          },
        ],
      },
      {
        name: "Agent API",
        apis: [
          {
            sig: "eai_agent_t *eai_agent_create(const eai_config_t *cfg)",
            desc: "Create a new EAI-Min agent instance with given config.",
            ret: "Pointer to agent, or NULL on OOM.",
            example: "eai_agent_t *agent = eai_agent_create(&cfg);",
          },
          {
            sig: "eai_status_t eai_agent_run(eai_agent_t *agent, const char *prompt, eai_result_t *out)",
            desc: "Run the ReAct agent loop with the given prompt. Blocks until completion or max_steps.",
            ret: "EAI_OK on success, EAI_ERR_TIMEOUT if max steps exceeded.",
            example:
              'eai_result_t res;\neai_agent_run(agent, "Turn on LED 13", &res);\nprintf("%s\\n", res.text);',
          },
          {
            sig: "void eai_agent_destroy(eai_agent_t *agent)",
            desc: "Free all resources associated with an agent instance.",
            ret: "void",
            example: "eai_agent_destroy(agent);",
          },
        ],
      },
      {
        name: "Model Registry",
        apis: [
          {
            sig: "eai_status_t eai_model_load(const char *path, eai_model_t **out)",
            desc: "Load a quantized model from filesystem into the model registry.",
            ret: "EAI_OK on success.",
            example:
              'eai_model_t *m;\neai_model_load("/models/llm-350m-int4.bin", &m);',
          },
          {
            sig: "eai_status_t eai_model_unload(eai_model_t *model)",
            desc: "Unload a model and free its memory.",
            ret: "EAI_OK on success.",
            example: "eai_model_unload(m);",
          },
          {
            sig: "int eai_model_list(eai_model_info_t *buf, int max)",
            desc: "List all loaded models. Returns count.",
            ret: "Number of models loaded.",
            example:
              "eai_model_info_t models[8];\nint n = eai_model_list(models, 8);",
          },
        ],
      },
    ],
  },
  {
    id: "eni",
    label: "ENI",
    icon: Activity,
    color: "#10B981",
    title: "ENI — Embedded Neural Interface",
    description:
      "1,024-channel neural recording, real-time spike sorting, and TENS neuromodulation",
    subsections: [
      {
        name: "Event System",
        apis: [
          {
            sig: "int eni_event_subscribe(eni_event_type_t type, eni_event_cb_t cb, void *ctx)",
            desc: "Subscribe to neural events (spike, epoch, impedance, saturation).",
            ret: "Subscription handle, or negative on error.",
            example:
              "int h = eni_event_subscribe(ENI_EVENT_SPIKE, on_spike, NULL);",
          },
          {
            sig: "void eni_event_unsubscribe(int handle)",
            desc: "Remove an event subscription.",
            ret: "void",
            example: "eni_event_unsubscribe(h);",
          },
        ],
      },
      {
        name: "Provider Contract API",
        apis: [
          {
            sig: "int eni_provider_register(const eni_provider_ops_t *ops, void *ctx)",
            desc: "Register a hardware provider (analog front-end driver).",
            ret: "Provider ID, or negative on error.",
            example:
              "extern const eni_provider_ops_t openbci_ops;\neni_provider_register(&openbci_ops, NULL);",
          },
          {
            sig: "int eni_provider_start(int provider_id)",
            desc: "Start acquisition on a registered provider.",
            ret: "0 on success.",
            example: "eni_provider_start(0);",
          },
          {
            sig: "int eni_provider_stop(int provider_id)",
            desc: "Stop acquisition and flush buffers.",
            ret: "0 on success.",
            example: "eni_provider_stop(0);",
          },
        ],
      },
      {
        name: "Safety Policy Engine",
        apis: [
          {
            sig: "int eni_safety_set_policy(const eni_safety_policy_t *policy)",
            desc: "Set global safety policy (max amplitude, max duration, kill-switch threshold).",
            ret: "0 on success.",
            example:
              "eni_safety_policy_t p = { .max_amplitude_uv = 500, .kill_switch_ms = 5 };\neni_safety_set_policy(&p);",
          },
          {
            sig: "void eni_safety_trigger_kill_switch(void)",
            desc: "Immediately halt all acquisition and stimulation. Wired to kernel scheduler.",
            ret: "void",
            example: "eni_safety_trigger_kill_switch(); // emergency stop",
          },
        ],
      },
      {
        name: "Calibration Workflow",
        apis: [
          {
            sig: "int eni_calibration_start(int provider_id, eni_cal_config_t *cfg)",
            desc: "Begin per-user calibration session. Collects baseline impedance and noise floor.",
            ret: "0 on success.",
            example:
              "eni_cal_config_t cal = { .duration_s = 30, .paradigm = ENI_CAL_MOTOR };\neni_calibration_start(0, &cal);",
          },
          {
            sig: "int eni_calibration_save(int provider_id, const char *path)",
            desc: "Save calibration profile to filesystem for later reload.",
            ret: "0 on success.",
            example: 'eni_calibration_save(0, "/cal/user1.cal");',
          },
          {
            sig: "int eni_calibration_load(int provider_id, const char *path)",
            desc: "Load a previously saved calibration profile.",
            ret: "0 on success.",
            example: 'eni_calibration_load(0, "/cal/user1.cal");',
          },
        ],
      },
    ],
  },
  {
    id: "eipc",
    label: "EIPC",
    icon: Network,
    color: "#F59E0B",
    title: "EIPC — Secure IPC Fabric",
    description:
      "Capability-secured IPC with HMAC-SHA256 authentication and zero-copy fast paths",
    subsections: [
      {
        name: "Client API",
        apis: [
          {
            sig: "eipc_handle_t eipc_connect(const char *channel, uint32_t flags)",
            desc: "Connect to a named channel. Returns an unforgeable capability handle.",
            ret: "Handle on success, EIPC_INVALID_HANDLE on error.",
            example:
              'eipc_handle_t h = eipc_connect("sensor.accel", EIPC_FLAG_RDONLY);',
          },
          {
            sig: "int eipc_send(eipc_handle_t h, const void *data, size_t len)",
            desc: "Send a message. HMAC-signed automatically. Blocks if queue is full.",
            ret: "0 on success, negative on error.",
            example: "eipc_send(h, &reading, sizeof(reading));",
          },
          {
            sig: "int eipc_recv(eipc_handle_t h, void *buf, size_t len, uint32_t timeout_ms)",
            desc: "Receive next message. Verifies HMAC before returning.",
            ret: "Bytes received, 0 on timeout, negative on error.",
            example: "sensor_reading_t r;\neipc_recv(h, &r, sizeof(r), 100);",
          },
          {
            sig: "void eipc_close(eipc_handle_t h)",
            desc: "Close a channel handle and release the capability.",
            ret: "void",
            example: "eipc_close(h);",
          },
        ],
      },
      {
        name: "Server API",
        apis: [
          {
            sig: "eipc_server_t *eipc_server_create(const char *channel, const eipc_server_cfg_t *cfg)",
            desc: "Create and bind a named channel server.",
            ret: "Server handle, or NULL on error.",
            example:
              'eipc_server_t *srv = eipc_server_create("sensor.accel", &cfg);',
          },
          {
            sig: "int eipc_server_accept(eipc_server_t *srv, eipc_handle_t *client_out)",
            desc: "Accept next incoming connection. Blocks until client connects.",
            ret: "0 on success.",
            example: "eipc_handle_t client;\neipc_server_accept(srv, &client);",
          },
          {
            sig: "void eipc_server_destroy(eipc_server_t *srv)",
            desc: "Destroy server and reject all pending connections.",
            ret: "void",
            example: "eipc_server_destroy(srv);",
          },
        ],
      },
      {
        name: "Frame Codec API",
        apis: [
          {
            sig: "int eipc_frame_encode(const eipc_frame_t *frame, uint8_t *buf, size_t buf_len)",
            desc: "Encode a frame to wire format with HMAC. Returns encoded length.",
            ret: "Encoded length, or negative on error.",
            example:
              "uint8_t wire[256];\nint n = eipc_frame_encode(&frame, wire, sizeof(wire));",
          },
          {
            sig: "int eipc_frame_decode(const uint8_t *buf, size_t len, eipc_frame_t *out)",
            desc: "Decode and verify a wire-format frame. Rejects tampered frames.",
            ret: "0 on success, EIPC_ERR_HMAC if authentication fails.",
            example:
              "eipc_frame_t frame;\nif (eipc_frame_decode(wire, n, &frame) != 0) reject();",
          },
        ],
      },
    ],
  },
  {
    id: "edb",
    label: "eDB",
    icon: HardDrive,
    color: "#3B82F6",
    title: "eDB — Embedded Database",
    description:
      "SQL, document, and key-value in one engine with REST API and AES-256 encryption",
    subsections: [
      {
        name: "Database Initialization",
        apis: [
          {
            sig: "edb_t *edb_open(const char *path, const edb_config_t *cfg)",
            desc: "Open or create a database at path. cfg may be NULL for defaults.",
            ret: "Database handle, or NULL on error.",
            example: 'edb_t *db = edb_open("/data/app.edb", NULL);',
          },
          {
            sig: "void edb_close(edb_t *db)",
            desc: "Flush and close a database handle.",
            ret: "void",
            example: "edb_close(db);",
          },
          {
            sig: "int edb_encrypt(edb_t *db, const uint8_t key[32])",
            desc: "Enable AES-256-XTS encryption with the given 256-bit key.",
            ret: "0 on success.",
            example:
              "uint8_t key[32]; // from eBoot chain-of-trust\nedb_encrypt(db, key);",
          },
        ],
      },
      {
        name: "SQL Engine",
        apis: [
          {
            sig: "edb_stmt_t *edb_prepare(edb_t *db, const char *sql)",
            desc: "Compile a SQL statement for repeated execution.",
            ret: "Statement handle, or NULL on syntax error.",
            example:
              'edb_stmt_t *s = edb_prepare(db, "SELECT * FROM sensors WHERE ts > ?");',
          },
          {
            sig: "int edb_exec(edb_t *db, const char *sql)",
            desc: "Execute a SQL statement that returns no rows.",
            ret: "0 on success, negative on error.",
            example:
              'edb_exec(db, "CREATE TABLE sensors (ts INTEGER, val REAL)");',
          },
          {
            sig: "int edb_step(edb_stmt_t *s)",
            desc: "Advance statement to next row. Returns EDB_ROW or EDB_DONE.",
            ret: "EDB_ROW if row available, EDB_DONE when finished.",
            example:
              "while (edb_step(s) == EDB_ROW) { double v = edb_column_double(s, 1); }",
          },
          {
            sig: "void edb_finalize(edb_stmt_t *s)",
            desc: "Release a prepared statement.",
            ret: "void",
            example: "edb_finalize(s);",
          },
        ],
      },
      {
        name: "Document Store",
        apis: [
          {
            sig: "int edb_doc_insert(edb_t *db, const char *collection, const char *json, char *id_out, size_t id_len)",
            desc: "Insert a JSON document into a collection. Generates a UUID id.",
            ret: "0 on success.",
            example:
              'char id[37];\nedb_doc_insert(db, "readings", "{\\"temp\\":23.5}", id, sizeof(id));',
          },
          {
            sig: "int edb_doc_get(edb_t *db, const char *collection, const char *id, char *json_out, size_t len)",
            desc: "Fetch a document by ID.",
            ret: "0 on success, EDB_NOT_FOUND if missing.",
            example:
              'char doc[512];\nedb_doc_get(db, "readings", id, doc, sizeof(doc));',
          },
          {
            sig: "int edb_doc_delete(edb_t *db, const char *collection, const char *id)",
            desc: "Delete a document by ID.",
            ret: "0 on success.",
            example: 'edb_doc_delete(db, "readings", id);',
          },
        ],
      },
      {
        name: "Key-Value Store",
        apis: [
          {
            sig: "int edb_kv_set(edb_t *db, const char *bucket, const char *key, const void *val, size_t len)",
            desc: "Set a key-value pair in a named bucket.",
            ret: "0 on success.",
            example: 'edb_kv_set(db, "config", "wifi_ssid", "MyNet", 6);',
          },
          {
            sig: "int edb_kv_get(edb_t *db, const char *bucket, const char *key, void *buf, size_t buf_len)",
            desc: "Get a value by key. Returns actual length.",
            ret: "Bytes read, or EDB_NOT_FOUND.",
            example:
              'char ssid[64];\nedb_kv_get(db, "config", "wifi_ssid", ssid, sizeof(ssid));',
          },
          {
            sig: "int edb_kv_delete(edb_t *db, const char *bucket, const char *key)",
            desc: "Delete a key-value pair.",
            ret: "0 on success.",
            example: 'edb_kv_delete(db, "config", "old_key");',
          },
        ],
      },
    ],
  },
  {
    id: "eboot",
    label: "eBoot",
    icon: RefreshCw,
    color: "#F97316",
    title: "eBootloader — Secure Multi-Architecture Bootloader",
    description:
      "A/B update slots, Ed25519 signed images, measured boot, and TPM 2.0 support",
    subsections: [
      {
        name: "Boot Control API",
        apis: [
          {
            sig: "int eboot_get_active_slot(void)",
            desc: "Return the currently active boot slot (0 = A, 1 = B).",
            ret: "0 or 1.",
            example:
              'int slot = eboot_get_active_slot();\nprintf("Active: %s\\n", slot ? "B" : "A");',
          },
          {
            sig: "int eboot_mark_healthy(void)",
            desc: "Mark the current boot as healthy. Prevents automatic rollback.",
            ret: "0 on success.",
            example:
              "// Call early in app startup after self-test\neboot_mark_healthy();",
          },
          {
            sig: "int eboot_request_update(int slot, const char *img_path)",
            desc: "Stage a firmware image for update on next reboot.",
            ret: "0 on success.",
            example: 'eboot_request_update(1, "/ota/firmware_v2.bin");',
          },
          {
            sig: "int eboot_rollback(void)",
            desc: "Immediately switch to the other slot and reboot.",
            ret: "Does not return on success.",
            example: "if (self_test_failed()) eboot_rollback();",
          },
        ],
      },
      {
        name: "Slot Manager API",
        apis: [
          {
            sig: "int eboot_slot_get_info(int slot, eboot_slot_info_t *out)",
            desc: "Get version, CRC, and health status for a slot.",
            ret: "0 on success.",
            example:
              'eboot_slot_info_t info;\neboot_slot_get_info(0, &info);\nprintf("v%u\\n", info.version);',
          },
          {
            sig: "int eboot_slot_erase(int slot)",
            desc: "Erase a firmware slot (use before writing new image).",
            ret: "0 on success.",
            example: "eboot_slot_erase(1); // prepare slot B",
          },
          {
            sig: "int eboot_slot_write(int slot, uint32_t offset, const void *data, size_t len)",
            desc: "Write data to a firmware slot at given offset.",
            ret: "0 on success.",
            example: "eboot_slot_write(1, 0, img_buf, img_len);",
          },
        ],
      },
      {
        name: "Boot Log API",
        apis: [
          {
            sig: "int eboot_log_get(eboot_log_entry_t *buf, int max)",
            desc: "Read boot log entries (reason, slot, timestamp, flags).",
            ret: "Number of entries read.",
            example:
              "eboot_log_entry_t log[8];\nint n = eboot_log_get(log, 8);",
          },
          {
            sig: "void eboot_log_clear(void)",
            desc: "Clear the boot log ring buffer.",
            ret: "void",
            example: "eboot_log_clear();",
          },
        ],
      },
    ],
  },
  {
    id: "ebuild",
    label: "eBuild",
    icon: Package,
    color: "#EF4444",
    title: "eBuild — Build System & SDK Generator",
    description:
      "18-command CLI, 14 SDK targets, profile composition, and reproducible builds",
    subsections: [
      {
        name: "CLI Commands",
        apis: [
          {
            sig: "ebuild init [--board <id>] [--profile <name>]",
            desc: "Initialize a new EoS project in the current directory. Downloads BSP and toolchain.",
            ret: "Exit 0 on success.",
            example: "ebuild init --board stm32h7 --profile sensor-node",
          },
          {
            sig: "ebuild build [--target <name>] [--release]",
            desc: "Build the project. --release enables LTO and size optimization.",
            ret: "Exit 0 on success.",
            example: "ebuild build --target eos --release",
          },
          {
            sig: "ebuild flash [--port <dev>] [--slot <a|b>]",
            desc: "Flash the built firmware to connected hardware.",
            ret: "Exit 0 on success.",
            example: "ebuild flash --port /dev/ttyUSB0 --slot b",
          },
          {
            sig: "ebuild monitor [--port <dev>] [--baud <rate>]",
            desc: "Open serial monitor to connected device.",
            ret: "Exit 0 on success.",
            example: "ebuild monitor --port /dev/ttyUSB0 --baud 115200",
          },
          {
            sig: "ebuild test [--filter <pattern>]",
            desc: "Run unit tests via EoSim. Produces JUnit XML output.",
            ret: "Exit 0 if all tests pass.",
            example: "ebuild test --filter 'gpio_*'",
          },
          {
            sig: "ebuild sdk [--target <name>]",
            desc: "Generate SDK (headers, libs, CMake config) for a component.",
            ret: "Exit 0 on success.",
            example: "ebuild sdk --target eai",
          },
          {
            sig: "ebuild sign [--key <path>] <image>",
            desc: "Sign a firmware image with Ed25519 private key.",
            ret: "Exit 0 on success.",
            example: "ebuild sign --key prod.key firmware.bin",
          },
          {
            sig: "ebuild clean",
            desc: "Remove build artifacts and generated files.",
            ret: "Exit 0 on success.",
            example: "ebuild clean",
          },
        ],
      },
      {
        name: "SDK Structure",
        apis: [
          {
            sig: "ebuild sdk --target eos",
            desc: "Generate EoS kernel SDK with HAL headers, libeos.a, and CMake package config.",
            ret: "Exit 0 on success.",
            example: "ebuild sdk --target eos # outputs sdk/eos/",
          },
          {
            sig: "ebuild sdk --target eai",
            desc: "Generate EAI runtime SDK with model headers and inference library.",
            ret: "Exit 0 on success.",
            example: "ebuild sdk --target eai",
          },
          {
            sig: "ebuild sdk --target eipc",
            desc: "Generate EIPC client/server SDK with capability headers.",
            ret: "Exit 0 on success.",
            example: "ebuild sdk --target eipc",
          },
        ],
      },
    ],
  },
  {
    id: "eosim",
    label: "EoSim",
    icon: Terminal,
    color: "#06B6D4",
    title: "EoSim — Embedded Systems Simulator",
    description: `${SIM_PLATFORM_COUNT} virtual platforms, QEMU + Renode, HIL bridge, and scriptable Python scenarios`,
    subsections: [
      {
        name: "CLI Commands",
        apis: [
          {
            sig: "eosim list [--arch <name>]",
            desc: "List all available virtual platforms. Filter by architecture.",
            ret: "Exit 0 on success.",
            example: "eosim list --arch cortex-m",
          },
          {
            sig: "eosim run <platform> <firmware> [--script <py>]",
            desc: "Run firmware on a virtual platform. Optionally attach a Python scenario script.",
            ret: "Exit code from firmware or script.",
            example: "eosim run stm32h743 firmware.elf --script test_gpio.py",
          },
          {
            sig: "eosim stats <platform>",
            desc: "Show performance statistics for the last simulation run.",
            ret: "Exit 0 on success.",
            example: "eosim stats stm32h743",
          },
          {
            sig: "eosim gui <platform> <firmware>",
            desc: "Launch the graphical simulation UI with live peripheral state.",
            ret: "Exit 0 on success.",
            example: "eosim gui rpi4 firmware.elf",
          },
        ],
      },
      {
        name: "Python Scenario API",
        apis: [
          {
            sig: "sim.gpio_write(pin: int, value: bool) -> None",
            desc: "Drive a GPIO pin from the test script.",
            ret: "None",
            example: "sim.gpio_write(13, True)  # assert LED pin",
          },
          {
            sig: "sim.gpio_read(pin: int) -> bool",
            desc: "Read current GPIO pin state.",
            ret: "bool",
            example: "assert sim.gpio_read(2) == False  # button released",
          },
          {
            sig: "sim.uart_send(port: int, data: bytes) -> None",
            desc: "Inject bytes into a UART port.",
            ret: "None",
            example: "sim.uart_send(0, b'AT+RST\\r\\n')",
          },
          {
            sig: "sim.advance_time(ms: int) -> None",
            desc: "Advance simulation clock by ms milliseconds without real-time delay.",
            ret: "None",
            example: "sim.advance_time(5000)  # skip 5 seconds",
          },
          {
            sig: "sim.inject_fault(fault_type: str, target: str) -> None",
            desc: "Inject a fault (bit_flip, brown_out, peripheral_fail) at target.",
            ret: "None",
            example: "sim.inject_fault('brown_out', 'vcc')",
          },
        ],
      },
    ],
  },
  {
    id: "eostudio",
    label: "EoStudio",
    icon: Code2,
    color: "#8B5CF6",
    title: "EoStudio — Embedded IDE",
    description:
      "Visual board picker, profile composer, HAL configurator, and integrated EoSim debugger",
    subsections: [
      {
        name: "Workspace API (Plug-in)",
        apis: [
          {
            sig: "studio.board.select(board_id: string): Promise<void>",
            desc: "Programmatically select a board in the Board Picker panel.",
            ret: "Promise resolving when board is loaded.",
            example: "await studio.board.select('stm32h743');",
          },
          {
            sig: "studio.profile.set(feature: string, enabled: boolean): void",
            desc: "Enable or disable a feature flag in the Profile Composer.",
            ret: "void",
            example: "studio.profile.set('EOS_FEATURE_MQTT', true);",
          },
          {
            sig: "studio.hal.configure(peripheral: string, config: object): void",
            desc: "Configure a peripheral in the HAL Configurator.",
            ret: "void",
            example: "studio.hal.configure('UART0', { baudrate: 115200 });",
          },
          {
            sig: "studio.sim.run(firmware: string): Promise<SimSession>",
            desc: "Launch EoSim with the given firmware file.",
            ret: "Promise resolving to a SimSession handle.",
            example:
              "const sess = await studio.sim.run('./build/firmware.elf');",
          },
        ],
      },
      {
        name: "Debug API",
        apis: [
          {
            sig: "studio.debug.setBreakpoint(file: string, line: number): void",
            desc: "Set a source-level breakpoint.",
            ret: "void",
            example: "studio.debug.setBreakpoint('main.c', 42);",
          },
          {
            sig: "studio.debug.readMemory(addr: number, len: number): Promise<Uint8Array>",
            desc: "Read device memory at address.",
            ret: "Promise resolving to byte array.",
            example:
              "const mem = await studio.debug.readMemory(0x20000000, 64);",
          },
          {
            sig: "studio.debug.evalExpression(expr: string): Promise<string>",
            desc: "Evaluate a C expression in the current debug context.",
            ret: "Promise resolving to string representation.",
            example:
              "const val = await studio.debug.evalExpression('sensor.temp');",
          },
        ],
      },
    ],
  },
  {
    id: "eoffice",
    label: "eOffice",
    icon: FileText,
    color: "#059669",
    title: "eOffice — Embedded Office Suite",
    description:
      "11-app suite: eDocs, eSheets, eSlides, eMail, eDrive, and more — built in Flutter",
    subsections: [
      {
        name: "eDocs API",
        apis: [
          {
            sig: "eoffice_doc_t *edocs_open(const char *path)",
            desc: "Open a document file (DOCX, ODT, MD). Returns document handle.",
            ret: "Document handle, or NULL on error.",
            example: 'eoffice_doc_t *doc = edocs_open("/docs/report.docx");',
          },
          {
            sig: "int edocs_insert_text(eoffice_doc_t *doc, size_t offset, const char *text)",
            desc: "Insert text at byte offset. CRDT-safe for concurrent edits.",
            ret: "0 on success.",
            example: 'edocs_insert_text(doc, 0, "Hello EoS!\\n");',
          },
          {
            sig: "int edocs_export_pdf(eoffice_doc_t *doc, const char *out_path)",
            desc: "Export document to PDF via the eDB print pipeline.",
            ret: "0 on success.",
            example: 'edocs_export_pdf(doc, "/tmp/report.pdf");',
          },
          {
            sig: "void edocs_close(eoffice_doc_t *doc)",
            desc: "Save and close a document handle.",
            ret: "void",
            example: "edocs_close(doc);",
          },
        ],
      },
      {
        name: "eSheets API",
        apis: [
          {
            sig: "eoffice_sheet_t *esheets_open(const char *path)",
            desc: "Open a spreadsheet file (XLSX, ODS, CSV).",
            ret: "Sheet handle, or NULL on error.",
            example: 'eoffice_sheet_t *s = esheets_open("/data/sensors.xlsx");',
          },
          {
            sig: "int esheets_set_cell(eoffice_sheet_t *s, int row, int col, const char *value)",
            desc: "Set a cell value (number, string, or formula starting with '=').",
            ret: "0 on success.",
            example: 'esheets_set_cell(s, 0, 0, "=SUM(B1:B10)");',
          },
          {
            sig: "const char *esheets_get_cell(eoffice_sheet_t *s, int row, int col)",
            desc: "Get computed cell value as string.",
            ret: "Pointer to value string (valid until next call).",
            example: 'printf("%s\\n", esheets_get_cell(s, 0, 0));',
          },
        ],
      },
    ],
  },
  {
    id: "ebrowser",
    label: "eBrowser",
    icon: Globe,
    color: "#0EA5E9",
    title: "eBrowser — Embedded Web Browser Engine",
    description:
      "HTML5 + CSS3 + HTTP/HTTPS browser engine for kiosks, IoT dashboards, and EoS devices",
    subsections: [
      {
        name: "Core Engine",
        apis: [
          {
            sig: "eb_handle_t eb_create(const eb_config_t *cfg)",
            desc: "Create a browser instance with given config (width, height, flags).",
            ret: "Browser handle, or EB_INVALID_HANDLE on error.",
            example:
              "eb_config_t cfg = { .width=1024, .height=768, .flags=EB_FLAG_RESIZABLE };\neb_handle_t b = eb_create(&cfg);",
          },
          {
            sig: "void eb_navigate(eb_handle_t b, const char *url)",
            desc: "Navigate to a URL. Asynchronous — use eb_on_load to get notified.",
            ret: "void",
            example: 'eb_navigate(b, "https://embeddedos.org");',
          },
          {
            sig: "void eb_run(eb_handle_t b)",
            desc: "Enter the browser event loop. Blocks until window is closed.",
            ret: "void",
            example: "eb_run(b);",
          },
          {
            sig: "void eb_destroy(eb_handle_t b)",
            desc: "Destroy browser instance and free all resources.",
            ret: "void",
            example: "eb_destroy(b);",
          },
        ],
      },
      {
        name: "DOM Query API",
        apis: [
          {
            sig: "eb_node_t eb_query_selector(eb_handle_t b, const char *selector)",
            desc: "Find first element matching CSS selector.",
            ret: "Node handle, or EB_NULL_NODE if not found.",
            example: 'eb_node_t btn = eb_query_selector(b, "#submit");',
          },
          {
            sig: "int eb_query_selector_all(eb_handle_t b, const char *selector, eb_node_t *buf, int max)",
            desc: "Find all elements matching CSS selector.",
            ret: "Count of matching nodes.",
            example:
              'eb_node_t items[64];\nint n = eb_query_selector_all(b, ".item", items, 64);',
          },
          {
            sig: "const char *eb_get_text(eb_node_t node)",
            desc: "Get text content of a DOM node.",
            ret: "Pointer to text (valid until next DOM mutation).",
            example: 'printf("%s\\n", eb_get_text(btn));',
          },
          {
            sig: "int eb_set_attr(eb_node_t node, const char *attr, const char *value)",
            desc: "Set an attribute on a DOM node.",
            ret: "0 on success.",
            example: 'eb_set_attr(btn, "disabled", "true");',
          },
        ],
      },
    ],
  },
  {
    id: "eosuite",
    label: "eOSuite",
    icon: Package,
    color: "#F59E0B",
    title: "eOSuite — 43 Cross-Platform Applications",
    description:
      "CLI and GUI apps for productivity, media, games, connectivity, and security — running on EoS, Desktop (SDL2), and Web (WASM)",
    subsections: [
      {
        name: "Productivity CLI",
        apis: [
          {
            sig: "enote [file.txt]",
            desc: "Open or create a markdown note file in the terminal editor.",
            ret: "Exit code 0 on save.",
            example: "enote meeting-notes.txt",
          },
          {
            sig: 'ecalc "expression"',
            desc: "Evaluate a mathematical expression including unit conversions.",
            ret: "Numeric result printed to stdout.",
            example: 'ecalc "2+3*4"  # → 14',
          },
          {
            sig: "ecal --list",
            desc: "List upcoming calendar events from the local CalDAV store.",
            ret: "Formatted event list.",
            example: "ecal --list --days 7",
          },
          {
            sig: "efiles /path",
            desc: "Open the dual-pane file manager at the given path.",
            ret: "Exits when window is closed.",
            example: "efiles /home/eos",
          },
          {
            sig: "econverter <value> <from> <to>",
            desc: "Convert between units (length, weight, temperature, data).",
            ret: "Converted value with unit.",
            example: "econverter 5 km mi  # → 3.107 mi",
          },
          {
            sig: "eclock --timer <duration>",
            desc: "Start a countdown timer (e.g. 5m, 1h30m).",
            ret: "Exits when timer expires.",
            example: "eclock --timer 25m",
          },
        ],
      },
      {
        name: "Connectivity CLI",
        apis: [
          {
            sig: 'echat send "message"',
            desc: "Send a message to the default eChat channel.",
            ret: "0 on success.",
            example: 'echat send "Build passed!"',
          },
          {
            sig: "essh user@host",
            desc: "Open an SSH session to a remote host.",
            ret: "Exit code of remote shell.",
            example: "essh root@192.168.1.10",
          },
          {
            sig: "eweb --dump <URL>",
            desc: "Fetch a URL and dump the page text to stdout.",
            ret: "Page text on stdout.",
            example: "eweb --dump https://embeddedos.org",
          },
          {
            sig: "eserial /dev/ttyUSB0 [baud]",
            desc: "Open a serial terminal on the given device.",
            ret: "Exits on Ctrl+C.",
            example: "eserial /dev/ttyUSB0 115200",
          },
          {
            sig: "evpn connect <server>",
            desc: "Connect to an eVPN server.",
            ret: "0 on successful connection.",
            example: "evpn connect us-1",
          },
        ],
      },
      {
        name: "Build System",
        apis: [
          {
            sig: "cmake -B build-eos -DEAPPS_PORT=eos -DCMAKE_TOOLCHAIN_FILE=cmake/eos.cmake -DEOS_TARGET=<board>",
            desc: "Configure the eOSuite build for an EoS embedded target.",
            ret: "CMake configure exit code.",
            example:
              "cmake -B build-eos -DEAPPS_PORT=eos -DCMAKE_TOOLCHAIN_FILE=cmake/eos.cmake -DEOS_TARGET=stm32f4",
          },
          {
            sig: "cmake -B build-web -DEAPPS_PORT=web -DCMAKE_TOOLCHAIN_FILE=$EMSDK/.../Emscripten.cmake",
            desc: "Configure the eOSuite build for WebAssembly (Emscripten).",
            ret: "CMake configure exit code.",
            example:
              "source ~/emsdk/emsdk_env.sh && cmake -B build-web -DEAPPS_PORT=web ...",
          },
          {
            sig: "suite --list",
            desc: "List all installed eOSuite applications and their versions.",
            ret: "Formatted app list.",
            example: "suite --list",
          },
        ],
      },
    ],
  },
  {
    id: "eserviceapps",
    label: "eServiceApps",
    icon: Smartphone,
    color: "#EC4899",
    title: "eServiceApps — Flutter Mobile Super App",
    description:
      "Dart 3 + Flutter 3.x multi-module super app: eSocial, eRide, eTravel, eTrack, eWallet — powered by Firebase + Riverpod",
    subsections: [
      {
        name: "Social Module",
        apis: [
          {
            sig: "Future<void> createPost(PostModel post)",
            desc: "Create a new social post with optional media URLs.",
            ret: "Completes when post is written to Firestore.",
            example:
              "await socialService.createPost(PostModel(\n  content: 'Hello world!',\n  mediaUrls: [uploadedUrl],\n));",
          },
          {
            sig: "Stream<List<PostModel>> getFeed(String userId, {int limit = 20})",
            desc: "Stream the user's social feed, newest first.",
            ret: "Stream of post lists, updated in real-time.",
            example: "final feed = socialService.getFeed(userId, limit: 20);",
          },
          {
            sig: "Future<void> sendMessage(String chatId, MessageModel msg)",
            desc: "Send a chat message to a conversation.",
            ret: "Completes when message is delivered.",
            example:
              "await socialService.sendMessage(chatId, MessageModel(text: 'Hi!'));",
          },
        ],
      },
      {
        name: "Ride Module",
        apis: [
          {
            sig: "Future<BookingModel> requestRide(LatLng pickup, LatLng dest)",
            desc: "Request a ride from pickup to destination.",
            ret: "BookingModel with booking ID and estimated fare.",
            example:
              "final booking = await rideService.requestRide(\n  LatLng(37.78, -122.41), LatLng(37.33, -121.89)\n);",
          },
          {
            sig: "Stream<DriverLocation> trackDriver(String bookingId)",
            desc: "Stream real-time driver location for an active booking.",
            ret: "Stream of DriverLocation updates.",
            example: "final stream = rideService.trackDriver(booking.id);",
          },
        ],
      },
      {
        name: "Travel Module",
        apis: [
          {
            sig: "Future<List<DestinationModel>> searchDestinations(String query)",
            desc: "Search travel destinations by name or country.",
            ret: "List of matching DestinationModel objects.",
            example:
              "final results = await travelService.searchDestinations('Tokyo');",
          },
          {
            sig: "Future<BookingModel> bookFlight(FlightModel flight, PassengerModel passenger)",
            desc: "Book a flight for a passenger.",
            ret: "BookingModel with confirmation code.",
            example:
              "final booking = await travelService.bookFlight(flight, passenger);",
          },
        ],
      },
      {
        name: "Wallet Module",
        apis: [
          {
            sig: "Future<void> sendPayment(String recipientId, double amount, String currency)",
            desc: "Send a payment to another user.",
            ret: "Completes when transaction is confirmed.",
            example:
              "await walletService.sendPayment('user123', 25.00, 'USD');",
          },
          {
            sig: "Stream<List<TransactionModel>> getTransactions(String userId)",
            desc: "Stream transaction history for a user.",
            ret: "Stream of transaction lists.",
            example: "final txStream = walletService.getTransactions(userId);",
          },
        ],
      },
      {
        name: "MapView Widget",
        apis: [
          {
            sig: "MapView({ required LatLng center, double zoom = 14, List<Marker> markers = const [] })",
            desc: "Flutter widget wrapping google_maps_flutter with eServiceApps styling and marker clustering.",
            ret: "Widget — renders a Google Map with EmbeddedOS theme.",
            example:
              "MapView(\n  center: LatLng(37.78, -122.41),\n  zoom: 15,\n  markers: [Marker(markerId: MarkerId('pickup'), position: pickup)],\n)",
          },
          {
            sig: "Future<LatLng> MapView.getCenter()",
            desc: "Get the current center coordinates of the map.",
            ret: "LatLng of the current viewport center.",
            example: "final center = await mapController.getCenter();",
          },
          {
            sig: "Future<void> MapView.animateTo(LatLng target, {double zoom = 15})",
            desc: "Smoothly animate the camera to a target position.",
            ret: "Completes when animation finishes.",
            example:
              "await mapController.animateTo(LatLng(37.78, -122.41), zoom: 16);",
          },
        ],
      },
      {
        name: "AuthGuard & AppTheme",
        apis: [
          {
            sig: "AuthGuard({ required Widget child, String? redirectTo })",
            desc: "Route guard widget that redirects unauthenticated users to the login screen.",
            ret: "Widget — renders child if authenticated, redirects otherwise.",
            example:
              "AuthGuard(\n  child: DashboardScreen(),\n  redirectTo: '/login',\n)",
          },
          {
            sig: "bool AuthGuard.isAuthenticated(BuildContext ctx)",
            desc: "Check if the current user is authenticated via Firebase Auth.",
            ret: "true if a Firebase user session exists.",
            example: "if (AuthGuard.isAuthenticated(context)) { ... }",
          },
          {
            sig: "AppTheme.of(BuildContext ctx)",
            desc: "Get the current eServiceApps theme (light/dark/system).",
            ret: "AppThemeData with color scheme, typography, and spacing tokens.",
            example:
              "final theme = AppTheme.of(context);\nreturn Text('Hello', style: theme.titleLarge);",
          },
          {
            sig: "AppTheme.toggle(BuildContext ctx)",
            desc: "Toggle between light and dark theme, persisting the preference.",
            ret: "void — triggers widget rebuild with new theme.",
            example: "AppTheme.toggle(context);",
          },
        ],
      },
    ],
  },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        if (!(await copyText(text))) return;
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="p-1.5 rounded-md hover:bg-white/10 transition-colors text-white/40 hover:text-white"
      title="Copy"
    >
      {copied ? (
        <Check size={13} className="text-green-400" />
      ) : (
        <Copy size={13} />
      )}
    </button>
  );
}

function ApiCard({
  api,
}: {
  api: { sig: string; desc: string; ret: string; example: string };
}) {
  const [open, setOpen] = useState(false);
  const fnMatch = api.sig.match(/(\w+)\s*\(/);
  const fnName = fnMatch ? fnMatch[1] : "";
  const retType = api.sig.split(" ")[0];
  const rest = api.sig.slice(retType.length + 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-colors"
    >
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full text-left p-4 flex items-start justify-between gap-3 hover:bg-white/3 transition-colors"
      >
        <div className="flex-1 min-w-0">
          <code className="text-sm font-mono">
            <span className="text-[#F59E0B]">{retType}</span>{" "}
            <span className="text-[#22D3EE] font-semibold">{fnName}</span>
            <span className="text-white/60">{rest.slice(fnName.length)}</span>
          </code>
          <p className="text-xs text-white/50 mt-1 truncate">{api.desc}</p>
        </div>
        <ChevronRight
          size={14}
          className={`shrink-0 mt-1 text-white/30 transition-transform ${open ? "rotate-90" : ""}`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3 border-t border-white/5 pt-3">
              <p className="text-sm text-white/70">{api.desc}</p>
              <div>
                <span className="text-xs font-semibold text-white/40 uppercase tracking-wider">
                  Returns
                </span>
                <p className="text-sm text-[#34D399] mt-1">{api.ret}</p>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-white/40 uppercase tracking-wider">
                    Example
                  </span>
                  <CopyButton text={api.example} />
                </div>
                <pre className="text-xs bg-black/40 rounded-lg p-3 overflow-x-auto text-[#A78BFA] border border-white/5">
                  <code>{api.example}</code>
                </pre>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function ApiDocs() {
  const [activeModule, setActiveModule] = useState("hal");
  const [search, setSearch] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  const module = MODULES.find(m => m.id === activeModule)!;

  const filteredSubsections = module.subsections
    .map(sub => ({
      ...sub,
      apis: (sub.apis || []).filter(
        api =>
          !search ||
          api.sig.toLowerCase().includes(search.toLowerCase()) ||
          api.desc.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter(sub => sub.apis.length > 0);

  const totalApis = MODULES.reduce(
    (acc, m) =>
      acc + m.subsections.reduce((a, s) => a + (s.apis?.length || 0), 0),
    0
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "f") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white">
      {/* Hero */}
      <section className="relative pt-28 pb-12 px-4 border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-br from-[#22D3EE]/5 via-transparent to-[#A78BFA]/5" />
        <div className="max-w-7xl mx-auto relative">
          <div className="flex items-center gap-2 text-sm text-white/40 mb-4">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight size={14} />
            <Link href="/docs" className="hover:text-white transition-colors">
              Docs
            </Link>
            <ChevronRight size={14} />
            <span className="text-white">API Reference</span>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#22D3EE]/10 border border-[#22D3EE]/20 text-[#22D3EE] text-xs font-semibold mb-4">
                <Code2 size={12} />
                EoS API Reference v2.1
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold font-heading mb-3">
                EmbeddedOS <span className="text-gradient">API Reference</span>
              </h1>
              <p className="text-white/60 text-lg max-w-2xl">
                Complete C API documentation for all EoS modules. {totalApis}+
                functions across {MODULES.length} modules — from GPIO to OTA
                updates.
              </p>
            </div>
            <div className="flex gap-4 shrink-0">
              {[
                { label: "Functions", value: `${totalApis}+` },
                { label: "Modules", value: `${MODULES.length}` },
                { label: "Version", value: "v2.1" },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <div className="text-2xl font-bold text-[#22D3EE]">
                    {s.value}
                  </div>
                  <div className="text-xs text-white/40">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          {/* Search */}
          <div className="mt-6 relative max-w-lg">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
            />
            <input
              ref={searchRef}
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search functions… (⌘F)"
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#22D3EE]/50 focus:bg-white/8 transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto flex">
        {/* Sidebar */}
        <aside className="hidden lg:block w-56 shrink-0 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto py-6 pr-4 border-r border-white/5">
          <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-3 px-2">
            Modules
          </div>
          <nav className="space-y-0.5">
            {MODULES.map(m => {
              const Icon = m.icon;
              const count = m.subsections.reduce(
                (a, s) => a + (s.apis?.length || 0),
                0
              );
              return (
                <button
                  key={m.id}
                  onClick={() => setActiveModule(m.id)}
                  className={`w-full flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm transition-all ${
                    activeModule === m.id
                      ? "bg-white/8 text-white"
                      : "text-white/50 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon
                    size={14}
                    style={{
                      color: activeModule === m.id ? m.color : undefined,
                    }}
                  />
                  <span className="flex-1 text-left">{m.label}</span>
                  <span className="text-[10px] text-white/30">{count}</span>
                </button>
              );
            })}
          </nav>
          <div className="mt-6 px-2">
            <a
              href="https://github.com/embeddedos-org"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white transition-colors py-1"
            >
              <ExternalLink size={11} />
              GitHub Repositories
            </a>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 py-8 px-6">
          {/* Module header */}
          <motion.div
            key={activeModule}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-start gap-4 mb-8">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  background: `${module.color}20`,
                  border: `1px solid ${module.color}40`,
                }}
              >
                <module.icon size={22} style={{ color: module.color }} />
              </div>
              <div>
                <h2 className="text-2xl font-bold font-heading">
                  {module.title}
                </h2>
                <p className="text-white/50 text-sm mt-1">
                  {module.description}
                </p>
              </div>
            </div>

            {/* Mobile module selector */}
            <div className="lg:hidden flex gap-2 overflow-x-auto pb-3 mb-6">
              {MODULES.map(m => (
                <button
                  key={m.id}
                  onClick={() => setActiveModule(m.id)}
                  className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeModule === m.id
                      ? "bg-white/10 text-white"
                      : "text-white/40 hover:text-white"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {filteredSubsections.length === 0 ? (
              <div className="text-center py-16 text-white/30">
                <Search size={32} className="mx-auto mb-3 opacity-50" />
                <p>No functions match "{search}"</p>
              </div>
            ) : (
              <div className="space-y-10">
                {filteredSubsections.map(sub => (
                  <div key={sub.name}>
                    <h3
                      className="text-lg font-semibold mb-1"
                      style={{ color: module.color }}
                    >
                      {sub.name}
                    </h3>
                    {(sub as any).structs &&
                      (sub as any).structs.map((st: any) => (
                        <div
                          key={st.name}
                          className="mb-4 bg-white/3 border border-white/8 rounded-xl p-4"
                        >
                          <div className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2">
                            struct
                          </div>
                          <code className="text-sm font-mono text-[#F59E0B]">
                            {st.name}
                          </code>
                          <div className="mt-3 overflow-x-auto">
                            <table className="w-full text-xs">
                              <thead>
                                <tr className="text-white/30 border-b border-white/5">
                                  <th className="text-left pb-2 pr-4 font-medium">
                                    Field
                                  </th>
                                  <th className="text-left pb-2 pr-4 font-medium">
                                    Type
                                  </th>
                                  <th className="text-left pb-2 font-medium">
                                    Description
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {st.fields.map((f: any) => (
                                  <tr
                                    key={f.name}
                                    className="border-b border-white/5 last:border-0"
                                  >
                                    <td className="py-1.5 pr-4 font-mono text-[#22D3EE]">
                                      {f.name}
                                    </td>
                                    <td className="py-1.5 pr-4 font-mono text-[#F59E0B]">
                                      {f.type}
                                    </td>
                                    <td className="py-1.5 text-white/60">
                                      {f.desc}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      ))}
                    <div className="space-y-2">
                      {sub.apis.map(api => (
                        <ApiCard key={api.sig} api={api} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
